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
	const closest = []
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

// find target that is as close to dist away from you as possible
TargetFinder.FindAtDist = function( self,targets,dist )
{
	const targetDistSq = dist * dist
	let closest = null
	let error = 9999999
	for( const target of targets )
	{
		const curDist = target.pos.Copy().Subtract( self.pos ).GetLenSq()
		const curError = curDist - targetDistSq
		if( curError < error )
		{
			closest = target
			error = curError
		}
	}
	
	return( closest )
}

TargetFinder.FindFarthest = function( self,targets )
{
	let farthest = null
	let farthestDist = 0
	for( const target of targets )
	{
		const curDist = target.pos.Copy().Subtract( self.pos ).GetLenSq()
		if( curDist > farthestDist )
		{
			farthest = target
			farthestDist = curDist
		}
	}
	
	return( farthest )
}

TargetFinder.FindRandom = function( targets )
{
	return( targets[Utils.RandInt( 0,targets.length )] )
}