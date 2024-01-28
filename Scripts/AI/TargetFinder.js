class TargetFinder {}

TargetFinder.FindClosest = function( self,targets,ignoreTarget = null )
{
	let closest = null
	let closestDist = 999999
	for( const target of targets )
	{
		if( target == ignoreTarget ) continue
		
		const curDist = target.pos.Copy().Subtract( self.pos ).GetLenSq()
		if( curDist < closestDist )
		{
			closest = target
			closestDist = curDist
		}
	}
	
	return( closest )
}

TargetFinder.FindClosestArr = function( self,targets )
{
	let closest = []
	for( const target of targets )
	{
		const curDist = target.pos.Copy().Subtract( self.pos ).GetLenSq()
		closest.push( { target: target,dist: curDist } )
	}
	
	closest.sort( function( a,b )
	{
		return( a.dist - b.dist )
	} )
	
	return( closest )
}