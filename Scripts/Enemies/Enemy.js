class Enemy extends Entity
{
	constructor( pos,sprShtPath = null )
	{
		super( pos,Vec2.One().Scale( 7.5 ),5 )
		// this.col = "#" + Utils.RandHexChar( 10,16 ) + Utils.RandHexChar( 10,16 ) +
		// 	 Utils.RandHexChar( 0,5 ) + Utils.RandHexChar( 0,5 ) + 
		// 	 Utils.RandHexChar( 0,5 ) + Utils.RandHexChar( 0,5 )
		
		this.animBulletSprPath = "Images/Bullet/EnemyBullet.png"
		
		if( sprShtPath != null )
		{
			this.sprSht = new SprSheet( SpriteCodex.LoadSpr( sprShtPath ),8,8 )
			this.idleAnim = new Anim( this.sprSht,0,2 )
			this.walkAnim = new Anim( this.sprSht,1,2 )
			this.animHand = new AnimHandler( [ this.idleAnim,this.walkAnim ] )
		}
		else this.col = "red"
		
		this.ai = new FollowTargetAI()
		this.spd = 0.6
		this.aiMove = Vec2.Zero()
		this.moveDelay = new Timer( 0.5,false,true )
		
		this.attackTimer = new Timer( 2.5,false,true )
		this.attackPattern = new ShotPattern( 1 )
		this.bulletSpd = 1.2
		this.bulletRange = 80
		this.targetStyle = TargetFinder.FindClosest
		
		this.isBoss = false
		this.bossScale = 2
	}
	
	Update( info )
	{
		this.UpdateMove( info )
		
		this.UpdateAttack( info )
		
		this.UpdateAnim()
	}
	
	UpdateMove( info )
	{
		if( this.moveDelay.Update() )
		{
			this.aiMove = this.ai.GetMove( this,info )
			this.moveDelay.Reset()
		}
		// this.pos.Add( move.Scale( this.spd  ) )
		this.TryMove( this.aiMove.Copy().Scale( this.spd ),info.map )
	}
	
	UpdateAttack( info )
	{
		if( this.attackTimer.Update() )
		{
			this.attackTimer.Reset()
			
			const target = this.targetStyle( this,info.players )
			if( target != null )
			{
				// need to pass target here for PredictShotPattern
				const angs = this.attackPattern.GetShotAngles( this.pos,target.pos,target )
				for( const ang of angs ) this.FireBullet( ang,info )
			}
		}
	}
	
	UpdateAnim()
	{
		if( this.animHand )
		{
			this.animHand.SwitchTo( this.aiMove.Equals( Vec2.Zero() ) ? 0 : 1,false )
			
			this.animHand.Update()
		}
	}
	
	Draw( gfx )
	{
		if( this.sprSht != null )
		{
			if( this.isBoss )
			{
				this.animHand.DrawScaled( this.pos.Copy().Subtract(
					this.sprSht.GetItemSize().Copy().Scale( this.bossScale ).Divide( 2 ) ),
					this.bossScale,gfx,this.dir < 0 )
			}
			else
			{
				this.animHand.Draw( this.pos.Copy().Subtract( this.sprSht.GetItemSize().Copy().Divide( 2 ) ),
					gfx,this.dir < 0 )
			}
		}
		else super.Draw( gfx )
	}
	
	SetBoss( scale = this.bossScale )
	{
		this.bossScale = scale
		this.isBoss = true
		this.size.Scale( scale )
	}
	
	FireBullet( ang,info,spd = this.bulletSpd,range = this.bulletRange )
	{
		const bullet = new AnimBullet( this.pos,ang,spd,
			range,this.animBulletSprPath )
		bullet.parent = this
		info.enemyBullets.push( bullet )
	}
	
	GetVelocity()
	{
		return( this.aiMove.Copy().Scale( this.spd ) )
	}
}