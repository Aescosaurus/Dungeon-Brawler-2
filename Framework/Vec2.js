class Vec2
{
	constructor( x,y )
	{
		this.x = x
		this.y = y
	}
	
	Add( other )
	{
		this.x += other.x
		this.y += other.y
		
		return( this )
	}
	
	Subtract( other )
	{
		this.x -= other.x
		this.y -= other.y
		
		return( this )
	}
	
	Scale( amount )
	{
		this.x *= amount
		this.y *= amount
		
		return( this )
	}
	
	Divide( amount )
	{
		this.x /= amount
		this.y /= amount
		
		return( this )
	}
	
	GetLenSq()
	{
		return( this.x * this.x + this.y * this.y )
	}
	
	GetLen()
	{
		return( Math.sqrt( this.GetLenSq() ) )
	}
	
	Normalize()
	{
		let len = this.GetLen()
		
		if( len > 0.0 )
		{
			this.x /= len
			this.y /= len
		}
		
		return( this )
	}
	
	Copy()
	{
		return( new Vec2( this.x,this.y ) )
	}
	
	X()
	{
		return( new Vec2( this.x,0 )  )
	}
	
	Y()
	{
		return( new Vec2( 0,this.y ) )
	}
	
	Floor()
	{
		return( new Vec2( Math.floor( this.x ),Math.floor( this.y ) ) )
	}
	
	Equals( other )
	{
		return( this.x == other.x && this.y == other.y )
	}
}

Vec2.Zero = function()
{
	return( new Vec2( 0,0 ) )
}

Vec2.One = function()
{
	return( new Vec2( 1,1 ) )
}

Vec2.Up = function()
{
	return( new Vec2( 0,-1 ) )
}

Vec2.Down = function()
{
	return( new Vec2( 0,1 ) )
}

Vec2.Left = function()
{
	return( new Vec2( -1,0 ) )
}

Vec2.Right = function()
{
	return( new Vec2( 1,0 ) )
}