class Rect
{
	constructor( top,bot,left,right )
	{
		this.top = top
		this.bot = bot
		this.left = left
		this.right = right
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
}

Rect.CreateXYWH = function( x,y,width,height )
{
	return( new Rect( y,y + height,x,x + width ) )
}