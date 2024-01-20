class Utils {}

Utils.RandInt = function( min,max )
{
	return( Math.floor( Math.random() * ( max - min ) + min ) )
}

Utils.RandFloat = function( min,max )
{
	return( ( Math.random() * ( max - min ) ) + min )
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