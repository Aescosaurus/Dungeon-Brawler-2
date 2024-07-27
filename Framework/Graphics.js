class Graphics
{
	constructor()
	{
		this.canv = document.getElementById( "canv" )
		this.ctx = this.canv.getContext( "2d" )
		
		const scale = 4
		this.scale = scale
		this.xScale = scale
		this.yScale = scale
		
		// this.canv.width *= scale
		// this.canv.height *= scale
		this.ctx.scale( scale,scale )
		
		this.ctx.imageSmoothingEnabled = false
		this.ctx.mozImageSmoothingEnabled = false
		
		this.width = this.canv.width / scale
		this.height = this.canv.height / scale
		
		this.origScale = this.scale
		this.origWidth = this.width
		this.origHeight = this.height
		
		// console.log( this.width + " " + this.height )
		
		this.tileSize = 8
		
		const self = this
		addEventListener( "resize",function( e ) { self.CheckFullscreen( true ) } )
	}
	
	// if preserve aspect is false it will just try to match screen dimensions
	CheckFullscreen( preserveAspect )
	{
		if( preserveAspect )
		{
			this.width = this.origWidth
			this.height = this.origHeight
			
			const widthFactor = window.innerWidth / this.canv.width
			const heightFactor = window.innerHeight / this.canv.height
			
			// vertical true = matching screen height, false = matching screen width
			const vertical = widthFactor > heightFactor
			const scaling = ( vertical ? heightFactor : widthFactor )
			
			this.canv.width = this.canv.width * scaling
			this.canv.height = this.canv.height * scaling
			
			const scale = ( vertical ? this.canv.width / this.width : this.canv.height / this.height )
			this.scale = scale
			this.xScale = scale
			this.yScale = scale
			
			// console.log( "xscale " + ( this.canv.width / this.width ) +
			// 	" yscale " + ( this.canv.height / this.height ) )
			
			// if( vertical )
			// {
			// 	this.width = this.canv.width / this.scale
			// }
			// else
			// {
			// 	this.height = this.canv.height / this.scale
			// }
			
			this.width = this.canv.width / this.scale
			this.height = this.canv.height / this.scale
			
			this.ctx.scale( this.scale,this.scale )
			// this.ctx.scale( this.canv.width / this.width,this.canv.height / this.height )
			
			this.ctx.imageSmoothingEnabled = false
			this.ctx.mozImageSmoothingEnabled = false
		}
		else
		{
			this.width = this.origWidth
			this.height = this.origHeight
			
			// make it slightly bigger than screen size rounding to nearest valid pixel
			const newWidth = Math.ceil( window.innerWidth / this.scale / this.tileSize )
				* this.tileSize * this.scale
			const newHeight = Math.ceil( window.innerHeight / this.scale / this.tileSize )
				* this.tileSize * this.scale
			
			// const widthFactor = window.innerWidth / this.canv.width
			// const heightFactor = window.innerHeight / this.canv.height
			
			// vertical true = matching screen height, false = matching screen width
			// const vertical = widthFactor > heightFactor
			// const scaling = ( vertical ? heightFactor : widthFactor )
			
			// this.canv.width = this.canv.width * scaling
			// this.canv.height = this.canv.height * scaling
			
			// vertical true = matching screen height, false = matching screen width
			const vertical = ( window.innerWidth / this.canv.width ) >
				( window.innerHeight / this.canv.height )
			
			this.canv.width = newWidth
			this.canv.height = newHeight
			
			// this.canv.width = window.innerWidth 
			// this.canv.height = window.innerHeight
			
			this.xScale = this.canv.width / this.width
			this.yScale = this.canv.height / this.height
			const scale = ( vertical ? this.xScale : this.yScale )
			this.scale = scale
			
			// console.log( "xscale " + ( this.canv.width / this.width ) +
			// 	" yscale " + ( this.canv.height / this.height ) )
			
			// this.width = this.canv.width / this.scale
			// this.height = this.canv.height / this.scale
			
			this.width = this.canv.width / this.xScale
			this.height = this.canv.height / this.yScale
			
			// this.ctx.scale( this.scale,this.scale )
			this.ctx.scale( this.xScale,this.yScale )
			
			this.ctx.imageSmoothingEnabled = false
			this.ctx.mozImageSmoothingEnabled = false
		}
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
		x = Math.floor( x )
		y = Math.floor( y )
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
		x = Math.floor( x )
		y = Math.floor( y )
		
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
		x = Math.floor( x )
		y = Math.floor( y )
		
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