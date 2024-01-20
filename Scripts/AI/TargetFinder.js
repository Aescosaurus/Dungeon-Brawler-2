class TargetFinder {}

TargetFinder.FindClosest = function( self,targets )
{
	let closest = null
	let closestDist = 999999
	for( const target of targets )
	{
		const curDist = target.pos.Copy().Subtract( self.pos ).GetLenSq()
		if( curDist < closestDist )
		{
			closest = target
			closestDist = curDist
		}
	}
	
	return( closest )
}