class Enemy extends Entity
{
	constructor( pos,sprShtPath = null )
	{
		super( pos,Vec2.One().Scale( 7.5 ),5 )
		// this.col = "#" + Utils.RandHexChar( 10,16 ) + Utils.RandHexChar( 10,16 ) +
		// 	 Utils.RandHexChar( 0,5 ) + Utils.RandHexChar( 0,5 ) + 
		// 	 Utils.RandHexChar( 0,5 ) + Utils.RandHexChar( 0,5 )
		this.col = "red"
		
		this.animBulletSprPath = "Images/Bullet/EnemyBullet.png"
		
		if( sprShtPath != null )
		{
			this.sprSht = new SprSheet( SpriteCodex.LoadSpr( sprShtPath ),8,8 )
			this.idleAnim = new Anim( this.sprSht,0,2 )
			this.walkAnim = new Anim( this.sprSht,1,2 )
			this.animHand = new AnimHandler( [ this.idleAnim,this.walkAnim ] )
		}
		
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
		this.bossScale = 3
	}
	
	Update( info )
	{
		if( this.moveDelay.Update() )
		{
			this.aiMove = this.ai.GetMove( this,info )
			this.moveDelay.Reset()
		}
		// this.pos.Add( move.Scale( this.spd  ) )
		this.TryMove( this.aiMove.Copy().Scale( this.spd ),info.map )
		
		if( this.attackTimer.Update() )
		{
			this.attackTimer.Reset()
			
			const target = this.targetStyle( this,info.players )
			if( target != null )
			{
				const angs = this.attackPattern.GetShotAngles( this.pos,target.pos,target )
				for( const ang of angs )
				{
					const bullet = new AnimBullet( this.pos,ang,this.bulletSpd,
						this.bulletRange,this.animBulletSprPath )
					bullet.size = Vec2.One().Scale( 4 )
					info.enemyBullets.push( bullet )
				}
			}
		}
		
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
	
	GetVelocity()
	{
		return( this.aiMove.Copy().Scale( this.spd ) )
	}
}