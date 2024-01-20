class PredictTargetAI extends MovementAI
{
	constructor( predictAmount = 10,targetFinderFunc = TargetFinder.FindClosest )
	{
		super()
		
		this.predictAmount = predictAmount
		this.targetFinderFunc = targetFinderFunc
	}
	
	GetMove( self,info )
	{
		const target = this.targetFinderFunc( self,info.players )
		if( target != null )
		{
			const targetPos = target.pos.Copy().Add( target.GetMoveVec().Scale( this.predictAmount ) )
			const diff = targetPos.Copy().Subtract( self.pos )
			return( diff.Normalize() )
		}
		return( Vec2.Zero() )
	}
}