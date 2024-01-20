class Player extends Entity
{
	constructor( pos,ctrls,hp = 10,sprShtPath = null )
	{
		super( pos,Vec2.One().Scale( 7.5 ),hp )
		
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
	}
	
	Update( info )
	{
		this.UpdateMove( info )
		
		this.UpdateSuper( info )
		
		this.UpdateAnim( info )
	}
	
	UpdateMove( info )
	{
		this.move = this.ctrls.GetMove( info.mouse,info.kbd,this.pos )
		this.move.Normalize()
		
		// this.pos.Add( move.Copy().Scale( this.spd ) )
		this.TryMove( this.move.Copy().Scale( this.spd ),info.map )
	}
	
	UpdateSuper( info )
	{
		if( this.superResetTimer.Update() )
		{
			if( this.ctrls.HoldingSuperKeys( info.mouse,info.kbd ) )
			{
				if( this.superChargeTimer.Update() )
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
	
	Draw( gfx )
	{
		if( this.sprSht != null )
		{
			this.animHand.Draw( this.pos.Copy().Subtract( this.sprSht.GetItemSize().Copy().Divide( 2 ) ),
				gfx,this.dir < 0 )
		}
		else super.Draw( gfx )
	}
	
	UseSuper( info )
	{
		console.log( "Used super!" )
	}
	
	HandleSimpleShooting( info )
	{
		if( this.refire.Update() )
		{
			if( this.TryFireAutoBullet( info ) ) this.refire.Reset()
		}
	}
	
	FireBullet( ang,info,dmg = this.bulletDmg,createBulletFunc = this.CreateBullet )
	{
		const bullet = createBulletFunc( this.pos,ang,this.bulletSpd,this.bulletRange,this )
		bullet.dmg = dmg
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
}