class Counter
{
	constructor( count,startDone = false )
	{
		this.count = count
		this.cur = startDone ? count + 1 : 0
	}
	
	Tick()
	{
		++this.cur
		
		return( this.IsDone() )
	}
	
	Reset()
	{
		this.cur = 0
	}
	
	IsDone()
	{
		return( this.cur >= this.count )
	}
	
	GetCurItem()
	{
		return( this.cur )
	}
}