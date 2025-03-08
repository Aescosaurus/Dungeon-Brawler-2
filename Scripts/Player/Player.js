class Player extends Entity
{
	constructor( pos,ctrls,hp = 10,sprShtPath = null,playerId )
	{
		super( pos,Vec2.One().Scale( 7.5 ),hp )
		this.maxHP = hp
		
		this.playerId = playerId
		
		this.ctrls = ctrls
		
		this.bulletSpr = null
		this.bulletRot = 0
		
		if( sprShtPath != null )
		{
			this.sprSht = new SprSheet( SpriteCodex.LoadSpr( sprShtPath ),8,8 )
			this.idleAnim = new Anim( this.sprSht,0,2 )
			this.walkAnim = new Anim( this.sprSht,1,2 )
			this.animHand = new AnimHandler( [ this.idleAnim,this.walkAnim ] )
		}
		
		this.heartBar = new PlayerHeartBar( this.maxHP )
		this.heartBarDisappearTimer = new Timer( 1.2,true )
		
		this.col = "#FFFF00"
		
		this.spd = 1.5
		this.move = Vec2.Zero()
		
		this.refire = new Timer( 0.4 )
		this.shotPattern = new ShotPattern()
		this.attackRange = 65
		this.bulletSpd = 2
		this.bulletRange = 60
		this.bulletDmg = 1.2
		this.targetStyle = TargetFinder.FindClosest
		
		this.superChargeTimer = new Timer( 0.4 )
		this.superResetTimer = new Timer( 5.0,true )
		
		this.isPlayer = true
		this.targetable = true
		
		this.enemyArr = []
		this.playerBullets = []
		this.players = []
		this.enemyBullets = []
		
		this.items = []
		this.buffs = []
		
		// this.PickupItem( new Quiver() )
		// this.PickupItem( new Quickbow() )
		
		this.inactiveTimer = new Timer( 5.0 )
	}
	
	Update( info )
	{
		this.UpdateMove( info )
		
		this.UpdateSuper( info )
		
		this.UpdateAnim( info )
	}
	
	UpdateMove( info )
	{
		this.move = this.ctrls.GetMove( info.mouse,info.kbd,info.gpad,this.pos )
		if( !this.move.Equals( Vec2.Zero() ) ) this.inactiveTimer.Reset()
		// this.move.Normalize()
		
		// this.pos.Add( move.Copy().Scale( this.spd ) )
		this.TryMove( this.move.Copy().Scale( this.spd ),info.map )
	}
	
	UpdateSuper( info )
	{
		if( this.superResetTimer.Update() )
		{
			if( this.ctrls.HoldingSuperKeys( info.mouse,info.kbd,info.gpad ) )
			{
				this.inactiveTimer.Reset()
				if( this.superChargeTimer.Update() || !this.ctrls.HasSuperTimer() )
				{
					this.UseSuper( info )
					this.superChargeTimer.Reset()
					this.superResetTimer.Reset()
				}
			}
			else this.superChargeTimer.Reset()
		}
	}
	
	UpdateAnim( info )
	{
		if( this.animHand )
		{
			this.animHand.SwitchTo( this.move.Equals( Vec2.Zero() ) ? 0 : 1,false )
			
			this.animHand.Update()
		}
	}
	
	UpdateMisc()
	{
		const itemUpdateInfo = this.GenerateItemInfo()
		
		for( const item of this.items )
		{
			item.Update( itemUpdateInfo )
			
			for( const buff of item.buffs ) this.buffs.push( buff )
			item.buffs.length = 0
		}
		
		for( let i = 0; i < this.buffs.length; ++i )
		{
			if( this.buffs[i].UsedUp() )
			{
				this.buffs.splice( i,1 )
				--i
			}
		}
		
		this.heartBarDisappearTimer.Update()
		
		this.inactiveTimer.Update()
	}
	
	Draw( gfx )
	{
		if( this.sprSht != null )
		{
			this.animHand.Draw( this.pos.Copy().Subtract( this.sprSht.GetItemSize().Copy().Divide( 2 ) ),
				gfx,this.dir < 0 )
		}
		else super.Draw( gfx )
		
		if( !this.heartBarDisappearTimer.IsDone() )
		{
			this.heartBar.Draw( this.pos,this.hp,gfx )
		}
	}
	
	Damage( dmg,attacker )
	{
		super.Damage( dmg,attacker )
		
		this.OnTakeDmg( attacker )
		
		this.heartBarDisappearTimer.Reset()
	}
	
	Heal( amount,healer )
	{
		const healed = super.Heal( amount,healer )
		if( healed ) this.heartBarDisappearTimer.Reset()
		return( healed )
	}
	
	UseSuper( info )
	{
		console.log( "Used super!" )
	}
	
	OnKill() {}
	
	HandleSimpleShooting( info )
	{
		if( this.refire.Update() && this.CanFire( info ) )
		{
			if( this.TryFireAutoBullet( info ) ) this.refire.Reset()
		}
	}
	
	FireBullet( ang,info,dmg = this.bulletDmg,createBulletFunc = this.CreateBullet )
	{
		const bullet = createBulletFunc( this.pos,ang,this.bulletSpd,this.bulletRange,this )
		bullet.dmg = dmg
		bullet.parent = this
		
		for( const buff of this.buffs )
		{
			if( buff.type == BuffType.Piercing )
			{
				++bullet.hp
				buff.UseBuff()
				break
			}
		}
		
		info.playerBullets.push( bullet )
	}
	
	TryFireAutoBullet( info,createBulletFunc = this.CreateBullet )
	{
		const target = this.targetStyle( this,info.enemies )
		if( target != null )
		{
			const dist = target.pos.Copy().Subtract( this.pos ).GetLenSq()
			if( dist < Math.pow( this.attackRange,2 ) )
			{
				const angs = this.shotPattern.GetShotAngles( this.pos,target.pos )
				for( const ang of angs )
				{
					this.FireBullet( ang,info,this.bulletDmg,createBulletFunc )
				}
				
				return( true )
			}
		}
		
		return( false )
	}
	
	CreateBullet( pos,ang,bulletSpd,bulletRange,self )
	{
		const bullet = new Bullet( pos,ang,bulletSpd,bulletRange,self.bulletSpr )
		bullet.rotateOffset = self.bulletRot
		bullet.rotate = true
		return( bullet )
	}
	
	ItemFireBullet( pos,ang,bulletSpd,bulletRange,info,createBulletFunc,dmg = this.bulletDmg )
	{
		const bullet = createBulletFunc( pos,ang,bulletSpd,bulletRange,this )
		bullet.dmg = dmg
		bullet.parent = this
		info.playerBullets.push( bullet )
	}
	
	PickupItem( item )
	{
		this.items.push( item )
		
		const info = this.GenerateItemInfo()
		item.TriggerPickup( info )
	}
	
	SetupInfo( enemies,playerBullets,players,enemyBullets )
	{
		this.enemyArr = enemies
		this.playerBullets = playerBullets
		this.players = players
		this.enemyBullets = enemyBullets
	}
	
	SetPlayerId( id )
	{
		this.playerId = id
	}
	
	GenerateItemInfo()
	{
		const info = {}
		
		info.self = this
		info.enemies = this.enemyArr
		info.playerBullets = this.playerBullets
		info.players = this.players
		info.enemyBullets = this.enemyBullets
		
		return( info )
	}
	
	CanFire( info )
	{
		return( info.enemies.length > 0 && info.attackArea.Contains( this.pos ) )
	}
	
	GetPlayerId()
	{
		return( this.playerId )
	}
	
	Inactive()
	{
		return( this.inactiveTimer.IsDone() )
	}
	
	OnEnemyHit( enemy )
	{
		const info = this.GenerateItemInfo()
		info.enemy = enemy
		for( const item of this.items )
		{
			item.OnEnemyHit( info )
		}
	}
	
	OnEnemyKill( enemy )
	{
		const info = this.GenerateItemInfo()
		info.enemy = enemy
		for( const item of this.items )
		{
			item.OnKill( info )
		}
	}
	
	OnPierce( enemy,nHits )
	{
		const info = this.GenerateItemInfo()
		info.enemy = enemy
		info.nHits = nHits
		for( const item of this.items )
		{
			item.OnPierce( info )
		}
	}
	
	OnTakeDmg( attacker )
	{
		const info = this.GenerateItemInfo()
		info.enemy = attacker
		for( const item of this.items )
		{
			item.OnTakeDmg( info )
		}
	}
}