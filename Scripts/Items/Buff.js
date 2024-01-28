class BuffType {}

BuffType.Piercing = 1

class Buff
{
	constructor( type,duration,infinite = false )
	{
		this.type = type
		this.durCounter = new Counter( duration )
		this.infinite = infinite
	}
	
	UseBuff()
	{
		if( !this.infinite ) this.durCounter.Tick()
		
		return( this.type )
	}
	
	UsedUp()
	{
		return( !this.infinite && this.durCounter.IsDone() )
	}
}