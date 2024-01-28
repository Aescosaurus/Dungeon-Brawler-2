class Counter
{
	constructor( count,startDone = false,autoReset = false )
	{
		this.count = count
		this.cur = startDone ? count + 1 : 0
		this.autoReset = autoReset
	}
	
	Tick()
	{
		++this.cur
		
		if( this.autoReset && this.IsDone() )
		{
			this.Reset()
			return( true )
		}
		else return( this.IsDone() )
	}
	
	Reset()
	{
		this.cur = 0
	}
	
	SetCount( count )
	{
		this.count = count
	}
	
	IsDone()
	{
		return( this.cur >= this.count )
	}
	
	GetPercent()
	{
		return( Math.min( this.cur / this.count,1 ) )
	}
	
	GetCurItem()
	{
		return( this.cur )
	}
	
	GetCount()
	{
		return( this.count )
	}
}