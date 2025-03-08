class PlayerControl
{
	constructor( hasSuperTimer )
	{
		this.hasSuperTimer = hasSuperTimer
	}
	
	GetMove( mouse,kbd,gpad,myPos )
	{
		console.log( "PlayerControl GetMove not overridden!" )
		return( Vec2.Zero() )
	}
	
	HoldingSuperKeys( mouse,kbd,gpad )
	{
		console.log( "PlayerControl HoldingSuperKeys not overridden!" )
		return( false )
	}
	
	HasSuperTimer()
	{
		return( this.hasSuperTimer )
	}
	
	Reset() {}
}