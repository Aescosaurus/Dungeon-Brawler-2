class SkeletonBoss extends Skeleton
{
	constructor( pos )
	{
		super( pos )
		this.isBoss = true
		
		this.hp = 80
		this.spd *= 0.3
		
		// todo: change attack pattern & maybe bullets too?
		
		this.attackPattern = new ShotPattern( 16,0,true )
	}
}