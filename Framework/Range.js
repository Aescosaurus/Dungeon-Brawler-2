class Range
{
	constructor( min,max )
	{
		this.min = min
		this.max = max
	}
	
	GetRandVal()
	{
		return( Utils.RandInt( this.min,this.max ) )
	}
	
	GetLerpedVal( t )
	{
		return( Utils.Lerp( this.min,this.max,t ) )
	}
}