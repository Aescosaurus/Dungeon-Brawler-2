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
	
	MultiplyVec( vec )
	{
		this.x *= vec.x
		this.y *= vec.y
		
		return( this )
	}
	
	Divide( amount )
	{
		this.x /= amount
		this.y /= amount
		
		return( this )
	}
	
	DivideVec( vec )
	{
		this.x /= vec.x
		this.y /= vec.y
		
		return( this )
	}
	
	Set( other )
	{
		this.x = other.x
		this.y = other.y
	}
	
	SetXY( x,y )
	{
		this.x = x
		this.y = y
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
		const lenSq = this.GetLenSq()
		
		if( lenSq > 0.0 )
		{
			const len = Math.sqrt( lenSq )
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

Vec2.Rand = function()
{
	return( new Vec2( Utils.RandFloat( -1,1 ),Utils.RandFloat( -1,1 ) ) )
}

Vec2.Cardinals = function()
{
	return( [ Vec2.Up(),Vec2.Down(),Vec2.Left(),Vec2.Right() ] )
}