class Timer
{
	constructor( dur,startFinished = false,startRandom = false )
	{
		this.dur = dur * 60
		this.curTime = startFinished ? this.dur + 1 : 0
		if( startRandom ) this.curTime = Utils.RandInt( 0,this.dur )
	}
	
	Update()
	{
		++this.curTime
		
		return( this.IsDone() )
	}
	
	Reset()
	{
		this.curTime = 0
	}
	
	SetDur( dur )
	{
		this.dur = dur * 60
	}
	
	IsDone()
	{
		return( this.curTime >= this.dur )
	}
}