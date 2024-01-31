class GamepadControl extends PlayerControl
{
	constructor( gpadIndex,gpadStick,gpadUlt )
	{
		super( false )
		
		this.gpadIndex = gpadIndex
		this.gpadStick = gpadStick
		this.gpadUlt = gpadUlt
	}
	
	GetMove( mouse,kbd,gpad,myPos )
	{
		if( gpad.IsGamepadConnected( this.gpadIndex ) )
		{
			const move = gpad.GetStick( this.gpadIndex,this.gpadStick )
			return( move )
		}
		else return( Vec2.Zero() )
	}
	
	HoldingSuperKeys( mouse,kbd,gpad )
	{
		if( gpad.IsGamepadConnected( this.gpadIndex ) )
		{
			return( gpad.GetButtonDown( this.gpadIndex,this.gpadUlt ) )
		}
		else return( false )
	}
}