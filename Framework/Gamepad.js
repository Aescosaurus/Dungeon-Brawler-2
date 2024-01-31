class Gamepad
{
	constructor()
	{
		this.deadZone = 0.1
		this.gamepads = []
		
		this.enableLogs = false
		
		const self = this
		
		window.addEventListener( "gamepadconnected",function( e )
		{
			const gPad = navigator.getGamepads()[e.gamepad.index]
			self.gamepads[e.gamepad.index] = gPad
			if( self.enableLogs ) console.log( "Gamepad " + e.gamepad.index + " connected" )
		} );
		
		window.addEventListener( "gamepaddisconnected",function( e )
		{
			self.gamepads.splice( e.gamepad.index,1 )
			if( self.enableLogs ) console.log( "Gamepad " + e.gamepad.index + " disconnected" )
		} );
	}
	
	// have to fetch gamepad info every frame, it doesn't update on it's own
	PollGamepads()
	{
		if( this.gamepads.length > 0 )
		{
			const gpads = navigator.getGamepads()
			for( let i in gpads ) this.gamepads[i] = gpads[i]
			
			// for( const i in this.gamepads[0].buttons )
			// {
			// 	if( this.gamepads[0].buttons[i].pressed )
			// 	{
			// 		console.log( i )
			// 	}
			// }
		}
	}
	
	IsGamepadConnected( gpadIndex )
	{
		return( gpadIndex >= 0 && gpadIndex < this.gamepads.length &&
			this.gamepads[gpadIndex] )
	}
	
	GetAxis( gpadIndex,axis )
	{
		if( !this.IsGamepadConnected( gpadIndex ) )
		{
			console.log( "Invalid gpadIndex " + gpadIndex )
			return( 0 )
		}
		else
		{
			return( this.gamepads[gpadIndex].axes[axis] )
		}
	}
	
	GetStick( gpadIndex,stickIndex )
	{
		if( stickIndex != 0 && stickIndex != 1 )
		{
			console.log( "Invalid stick index! " + stickIndex )
			return( Vec2.Zero() )
		}
		else
		{
			let x = this.GetAxis( gpadIndex,stickIndex * 2 )
			let y = this.GetAxis( gpadIndex,stickIndex * 2 + 1 )
			
			if( Math.abs( x ) < this.deadZone ) x = 0
			if( Math.abs( y ) < this.deadZone ) y = 0
			
			return( new Vec2( x,y ) )
		}
	}
	
	GetButtonDown( gpadIndex,buttonIndex )
	{
		if( gpadIndex < 0 || gpadIndex >= this.gamepads.length )
		{
			console.log( "Invalid gpadIndex " + gpadIndex )
			return( false )
		}
		else if( buttonIndex < 0 || buttonIndex >= this.gamepads[gpadIndex].buttons.length )
		{
			console.log( "Invalid buttonIndex " + buttonIndex )
			return( false )
		}
		else
		{
			const button = this.gamepads[gpadIndex].buttons[buttonIndex]
			return( button.pressed || button.touched || button.value > 0 )
		}
	}
}