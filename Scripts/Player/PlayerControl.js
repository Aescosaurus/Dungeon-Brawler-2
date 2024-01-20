class PlayerControl
{
	constructor( up,down,left,right,useMouse = false )
	{
		this.up = up
		this.down = down
		this.left = left
		this.right = right
		
		this.useMouse = useMouse
	}
	
	GetMove( mouse,kbd,myPos )
	{
		if( this.useMouse )
		{
			const mousePos = new Vec2( mouse.x,mouse.y )
			const diff = mousePos.Subtract( myPos )
			
			const minDiff = 4
			return( diff.GetLenSq() > Math.pow( minDiff,2 ) ? diff : Vec2.Zero() )
		}
		else
		{
			const move = Vec2.Zero()
			if( kbd.KeyDown( this.up ) ) --move.y
			if( kbd.KeyDown( this.down ) ) ++move.y
			if( kbd.KeyDown( this.left ) ) --move.x
			if( kbd.KeyDown( this.right ) ) ++move.x
			return( move )
		}
	}
	
	HoldingSuperKeys( mouse,kbd )
	{
		if( this.useMouse ) return( mouse.down )
		else
		{
			return( kbd.KeyDown( this.left ) && kbd.KeyDown( this.right ) )
		}
	}
}