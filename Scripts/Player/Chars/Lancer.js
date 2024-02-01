class Lancer extends Player
{
	constructor( pos,ctrls )
	{
		super( pos,ctrls,7,"Images/Char/Lancer.png" )
		
		this.spd = 1.5
		
		this.bulletDmg = 3
		
		this.superChargeTimer.SetDur( 0.2 )
		this.superResetTimer.SetDur( 2.5,true )
		
		this.superShotPattern = new ShotPattern( 3,10 )
		this.superTimer = new Timer( 0.15,true )
		this.superSpd = 4
		this.superTargetDist = 6
		
		this.superMoveDir = Vec2.Up()
		this.superWasDone = true
		
		this.spearCharge = new Timer( 1.5 )
		this.spearSizeRange = new Range( 0.6,2.5 )
		
		this.aimMove = Vec2.Zero()
	}
	
	Update( info )
	{
		if( this.superTimer.Update() )
		{
			if( !this.superWasDone )
			{
				this.superWasDone = true
				const angs = this.superShotPattern.GetShotAngles( this.pos,
					this.pos.Copy().Add( this.superMoveDir ) )
				this.spearCharge.Finish()
				for( const ang of angs ) this.FireBullet( ang,info )
				this.spearCharge.Reset()
			}
			
			super.Update( info )
			
			// fallback superMoveDir in case you use ult with no enemies around
			if( !this.move.Equals( Vec2.Zero() ) ) this.superMoveDir.Set( this.move )
		}
		else // super charge
		{
			this.TryMove( this.superMoveDir.Copy().Scale( this.superSpd ),info.map )
			
			this.UpdateAnim( info )
		}
		
		if( this.move.Equals( Vec2.Zero() ) )
		{
			if( this.spearCharge.GetPercent() > 0 )
			{
				this.FireBullet( Math.atan2( this.aimMove.y,this.aimMove.x ),info,
					this.bulletDmg * this.spearCharge.GetPercent() )
				
				this.spearCharge.Reset()
			}
		}
		else
		{
			this.aimMove.Set( this.move )
			
			this.spearCharge.Update()
		}
	}
	
	UseSuper( info )
	{
		this.superTimer.Reset()
		this.superWasDone = false
		
		const targetEnemy = TargetFinder.FindAtDist( this,info.enemies,this.superTargetDist )
		if( targetEnemy != null )
		{
			this.superMoveDir = targetEnemy.pos.Copy().Subtract( this.pos ).Normalize()
		}
		// const closestList = TargetFinder.FindClosestArr( this,info.enemies )
		// for( const closest of closestList )
		// {
		// 	const enemy = closest.target
		// 	const diff = enemy.pos.Copy().Subtract( this.pos )
		// 	if( diff.GetLenSq() > Math.pow( this.superTargetDist,2 ) )
		// 	{
		// 		this.superMoveDir = enemy.pos.Copy().Subtract( this.pos ).Normalize()
		// 		break
		// 	}
		// }
	}
	
	CreateBullet( pos,ang,bulletSpd,bulletRange,self )
	{
		const bullet = new SpearBullet( pos,ang,bulletSpd,bulletRange )
		bullet.rotateOffset = self.bulletRot
		bullet.ScaleUp( self.spearSizeRange.GetLerpedVal( self.spearCharge.GetPercent() ) )
		return( bullet )
	}
}