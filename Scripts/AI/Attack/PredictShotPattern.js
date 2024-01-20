class PredictShotPattern extends ShotPattern
{
	constructor( nShots = 1,shotAng = 15,autoAng = false,predictAmount = 10 )
	{
		super( nShots,shotAng,autoAng )
		
		this.predictAmount = predictAmount
	}
	
	GetShotAngles( myPos,targetPos,target )
	{
		const adjustedTargetPos = targetPos.Copy().Add( target.GetMoveVec().Copy().Scale( this.predictAmount ) )
		return( super.GetShotAngles( myPos,adjustedTargetPos ) )
	}
}