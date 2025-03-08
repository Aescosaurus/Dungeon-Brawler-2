class Sprite
{
	constructor( path )
	{
		this.img = new Image()
		this.img.src = path
		this.width = -1
		this.height = -1
		
		const self = this
		
		this.img.onload = function()
		{
			self.width = self.img.width
			self.height = self.img.height
		}
	}
	
	Contains( x,y,sx,sy,centered = false )
	{
		if( centered )
		{
			sx -= this.width / 2
			sy -= this.height / 2
		}
		return( x <= sx + this.width && x >= sx &&
			y <= sy + this.height && y >= sy )
	}
	
	GetRect()
	{
		return( new Rect( 0,this.height,0,this.width ) )
	}
}