class Graphics
{
	constructor()
	{
		this.canv = document.getElementById( "canv" )
		this.ctx = this.canv.getContext( "2d" )
		
		this.ctx.imageSmoothingEnabled = false
		this.ctx.mozImageSmoothingEnabled = false
		
		const scale = 4
		this.scale = scale
		
		this.ctx.scale( scale,scale )
		
		this.width = this.canv.width / scale
		this.height = this.canv.height / scale
		
		// console.log( this.width + " " + this.height )
	}
	
	DrawRect( x,y,width,height,color )
	{
		this.ctx.fillStyle = color
		this.ctx.fillRect( x,y,width,height )
	}
	
	DrawCircle( x,y,radius,color )
	{
		this.ctx.strokeStyle = color
		this.ctx.beginPath()
		this.ctx.arc( x,y,radius,0,2 * Math.PI )
		this.ctx.stroke()
	}
	
	DrawSprite( x,y,sprite,flipped = false )
	{
		if( flipped )
		{
			// gfx.ctx.save()
			this.ctx.translate( x + sprite.width,y )
			this.ctx.scale( -1,1 )
				
			this.ctx.drawImage( sprite.img,0,0,
				sprite.width,sprite.height )
			
			// gfx.ctx.restore()
			this.ctx.scale( -1,1 )
			this.ctx.translate( -( x + this.itemWidth ),-y )
		}
		else this.ctx.drawImage( sprite.img,x,y )
	}
	
	DrawSpriteRotated( x,y,sprite,angle )
	{
		angle *= ( Math.PI / 180 )
		
		const xMove = x
		const yMove = y
		
		this.ctx.translate( xMove,yMove )
		this.ctx.rotate( angle )
		
		this.ctx.drawImage( sprite.img,-sprite.width / 2,-sprite.height / 2,sprite.width,sprite.height )
		
		this.ctx.rotate( -angle )
		this.ctx.translate( -xMove,-yMove )
	}
	
	DrawSpriteRotatedScaled( x,y,sprite,xScale,yScale,angle )
	{
		angle *= ( Math.PI / 180 )
		
		const xMove = x
		const yMove = y
		
		this.ctx.translate( xMove,yMove )
		this.ctx.rotate( angle )
		
		const drawWidth = sprite.width * xScale
		const drawHeight = sprite.height * yScale
		
		this.ctx.drawImage( sprite.img,
			-drawWidth / 2,-drawHeight / 2,
			drawWidth,drawHeight )
		
		this.ctx.rotate( -angle )
		this.ctx.translate( -xMove,-yMove )
	}
}