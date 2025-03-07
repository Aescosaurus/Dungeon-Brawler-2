class Rect
{
	constructor( top,bot,left,right )
	{
		this.top = top
		this.bot = bot
		this.left = left
		this.right = right
	}
	
	MoveBy( xMove,yMove )
	{
		this.top += yMove
		this.bot += yMove
		this.left += xMove
		this.right += xMove
		return( this )
	}
	
	MoveTo( x,y,centered = false )
	{
		const center = this.GetCenter()
		const xDiff = x - ( centered ? center.x : this.left )
		const yDiff = y - ( centered ? center.y : this.top )
		return( this.MoveBy( xDiff,yDiff ) )
	}
	
	GetRandPos()
	{
		return( new Vec2(
			Utils.RandInt( this.left,this.right ),
			Utils.RandInt( this.top,this.bot ) ) )
	}
	
	GetAreaTiles()
	{
		const tiles = []
		for( let y = this.top; y <= this.bot; ++y )
		{
			for( let x = this.left; x <= this.right; ++x )
			{
				tiles.push( new Vec2( x,y ) )
			}
		}
		return( tiles )
	}
	
	GetEdgeTiles()
	{
		const tiles = []
		for( let x = this.left; x <= this.right; ++x ) tiles.push( new Vec2( x,this.top ) )
		for( let x = this.left; x <= this.right; ++x ) tiles.push( new Vec2( x,this.bot ) )
		for( let y = this.top; y <= this.bot; ++y ) tiles.push( new Vec2( this.left,y ) )
		for( let y = this.top; y <= this.bot; ++y ) tiles.push( new Vec2( this.right,y ) )
		return( tiles )
	}
	
	GetEdgeArrs()
	{
		const arrs = [ [],[],[],[] ]
		for( let x = this.left; x <= this.right; ++x ) arrs[0].push( new Vec2( x,this.top ) )
		for( let x = this.left; x <= this.right; ++x ) arrs[1].push( new Vec2( x,this.bot ) )
		for( let y = this.top; y <= this.bot; ++y ) arrs[2].push( new Vec2( this.left,y ) )
		for( let y = this.top; y <= this.bot; ++y ) arrs[3].push( new Vec2( this.right,y ) )
		return( arrs )
	}
	
	GetCenter()
	{
		return( new Vec2( this.left + this.right,this.top + this.bot ).Divide( 2 ) )
	}
	
	Contains( pos )
	{
		return( pos.x >= this.left && pos.x <= this.right &&
			pos.y >= this.top && pos.y <= this.bot )
	}
	
	Scale( amount )
	{
		this.left *= amount
		this.right *= amount
		this.top *= amount
		this.bot *= amount
	}
	
	GetWidth()
	{
		return( this.right - this.left )
	}
	
	GetHeight()
	{
		return( this.bot - this.top )
	}
}

Rect.CreateXYWH = function( x,y,width,height )
{
	return( new Rect( y,y + height,x,x + width ) )
}