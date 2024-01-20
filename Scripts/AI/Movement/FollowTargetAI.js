class FollowTargetAI extends MovementAI
{
	constructor( targetFinderFunc = TargetFinder.FindClosest )
	{
		super()
		
		this.targetFinderFunc = targetFinderFunc
	}
	
	GetMove( self,info )
	{
		const target = this.targetFinderFunc( self,info.players )
		if( target != null )
		{
			const diff = target.pos.Copy().Subtract( self.pos )
			return( diff.Normalize() )
		}
		return( Vec2.Zero() )
	}
}