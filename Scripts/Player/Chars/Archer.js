class Archer extends Player
{
	constructor( pos,ctrls )
	{
		super( pos,ctrls,7,"Images/Char/Archer.png" )
		
		this.spd = 1.4
		this.bulletSpr = SpriteCodex.LoadSpr( "Images/Bullet/Arrow.png" )
		this.bulletRot = 45
		
		this.refire = new Timer( 0.28 )
		this.shotPattern = new ShotPattern()
		
		this.attackRange = 150
		this.bulletSpd = 3
		this.bulletRange = 150
		this.bulletDmg = 0.65
		
		this.predictAmount = 20
		
		this.flurryCounter = new Counter( 30,true )
		this.flurryRefire = new Timer( 0.07 )
	}
	
	Update( info )
	{
		super.Update( info )
		
		if( this.refire.Update() )
		{
			if( this.TryFireAutoArcherBullet( info ) ) this.refire.Reset()
		}
		
		if( !this.flurryCounter.IsDone() )
		{
			if( this.flurryRefire.Update() )
			{
				this.flurryCounter.Tick()
				this.flurryRefire.Reset()
				
				this.TryFireAutoArcherBullet( info,true )
			}
		}
	}
	
	UseSuper( info )
	{
		// trigger flurry of rapid fire arrows
		this.flurryCounter.Reset()
	}
	
	TryFireAutoArcherBullet( info,ignoreRange = false )
	{
		const target = this.targetStyle( this,info.enemies )
		if( target != null )
		{
			const dist = target.pos.Copy().Subtract( this.pos ).GetLenSq()
			if( dist < Math.pow( this.attackRange,2 ) || ignoreRange )
			{
				const projectedTargetLoc = target.pos.Copy().Add(
					target.GetVelocity().Scale( this.predictAmount ) )
				
				const ang = this.shotPattern.GetShotAngles( this.pos,projectedTargetLoc )[0]
				this.FireBullet( ang,info )
				
				return( true )
			}
		}
		
		return( false )
	}
	
	CreateBullet( pos,ang,bulletSpd,bulletRange,self )
	{
		const bullet = super.CreateBullet( pos,ang,bulletSpd,bulletRange,self )
		bullet.hp = 2 // piercing
		return( bullet )
	}
}