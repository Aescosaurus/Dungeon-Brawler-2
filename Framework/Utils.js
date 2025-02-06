class Utils {}

Utils.RandInt = function( min,max )
{
	return( Math.floor( Math.random() * ( max - min ) + min ) )
}

Utils.RandFloat = function( min,max )
{
	return( ( Math.random() * ( max - min ) ) + min )
}

Utils.RandEvenInt = function( min,max )
{
	let rng = Utils.RandInt( min,max )
	if( rng % 2 != 0 ) --rng
	if( rng < min ) rng = min + 1
	return( rng )
}
Utils.RandOddInt = function( min,max )
{
	let rng = Utils.RandInt( min,max )
	if( rng % 2 == 0 ) --rng
	if( rng < min ) rng = min + 1
	return( rng )
}

Utils.Choose = function()
{
	return( Utils.RandFloat( 0,1 ) < 0.5 )
}

Utils.RandHexChar = function( min = 0,max = 16 )
{
	const chars = [ '0','1','2','3','4','5','6','7','8','9',"A","B","C","D","E","F" ]
	return( chars[Utils.RandInt( min,max )] )
}

Utils.RoughlyEquals = function( a,b,thresh = 0.0001 )
{
	return( Math.abs( a - b ) < thresh )
}

Utils.GetAng = function( pos,targetPos )
{
	const diff = targetPos.Copy().Subtract( pos )
	return( Math.atan2( diff.y,diff.x ) )
}

Utils.Deg2Rad = function( deg )
{
	return( deg * ( Math.PI / 180 ) )
}

Utils.Rad2Deg = function( rad )
{
	return( rad * ( 180 / Math.PI ) )
}

Utils.Lerp = function( a,b,t )
{
	return( a * ( 1 - t ) + ( b * t ) )
}

Utils.ShuffleArr = function( arr )
{
	let i = arr.length
	
	while( i > 0 )
	{
		const cur = Math.floor( Math.random() * i-- )
		
		const temp = arr[i]
		arr[i] = arr[cur]
		arr[cur] = temp
	}
}

Utils.ArrayChooseRand = function( arr )
{
	return( arr[Utils.RandInt( 0,arr.length )] )
}