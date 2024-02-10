class SkeletonBoss extends Skeleton
{
	constructor( pos )
	{
		super( pos )
		this.bossScale = 3
		this.SetBoss()
		
		this.hp = 80
		this.spd *= 0.3
		
		// todo: change attack pattern & maybe bullets too?
		
		this.bulletRange = 200
		
		this.aoeTimer = new Timer( 3 )
		this.aoePattern = new ShotPattern( 16,0,true )
		
		this.aimPlayerTimer = new Timer( 1.2 )
		this.aimPlayerPattern = new ShotPattern( 1 )
	}
	
	Update( info )
	{
		this.UpdateMove( info )
		this.UpdateAnim()
		
		if( this.aoeTimer.Update() )
		{
			this.Attack( this.aoePattern,this.targetStyle( this,info.players ),info )
			this.aoeTimer.Reset()
		}
		
		if( this.aimPlayerTimer.Update() )
		{
			for( const player of info.players ) this.Attack( this.aimPlayerPattern,player,info )
			
			this.aimPlayerTimer.Reset()
		}
	}
	
	Attack( shotPattern,target,info )
	{
		if( target != null )
		{
			const angs = shotPattern.GetShotAngles( this.pos,target.pos,target )
			for( const ang of angs )
			{
				const bullet = new AnimBullet( this.pos,ang,this.bulletSpd,
					this.bulletRange,this.animBulletSprPath )
				// bullet.size = Vec2.One().Scale( 4 )
				bullet.parent = this
				info.enemyBullets.push( bullet )
			}
		}
	}
}