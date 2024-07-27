class SprSheet
{
	constructor( sprite,itemWidth,itemHeight )
	{
		this.itemWidth = itemWidth
		this.itemHeight = itemHeight
		this.itemSize = new Vec2( this.itemWidth,this.itemHeight )
		
		this.spr = sprite
	}
	
	Draw( x,y,strip,index,gfx,flipped = false )
	{
		// x = this.GetPixelSafeX( x,flipped )
		// y = this.GetPixelSafeY( y )
		
		if( flipped )
		{
			// gfx.ctx.save()
			gfx.ctx.translate( x + this.itemWidth,y )
			gfx.ctx.scale( -1,1 )
			
			// gfx.ctx.drawImage( this.img,index * this.itemWidth,strip * this.itemHeight,
			// 	this.itemWidth,this.itemHeight,
			// 	x - gfx.width + this.itemWidth,y,
			// 	-this.itemWidth,this.itemHeight )
				
			gfx.ctx.drawImage( this.spr.img,index * this.itemWidth,strip * this.itemHeight,
				this.itemWidth,this.itemHeight,
				0,0,
				this.itemWidth,this.itemHeight )
			
			// gfx.ctx.restore()
			gfx.ctx.scale( -1,1 )
			gfx.ctx.translate( -( x + this.itemWidth ),-y )
		}
		else
		{
			gfx.ctx.drawImage( this.spr.img,index * this.itemWidth,strip * this.itemHeight,
				this.itemWidth,this.itemHeight,
				x,y,
				this.itemWidth,this.itemHeight )
		}
	}
	
	DrawRotated( x,y,strip,index,angle,gfx )
	{
		angle *= ( Math.PI / 180 )
		
		const xMove = x
		const yMove = y
		
		this.ctx.translate( xMove,yMove )
		this.ctx.rotate( angle )
		
		// this.ctx.drawImage( sprite.img,-sprite.width / 2,-sprite.height / 2,sprite.width,sprite.height )
		
		gfx.ctx.drawImage( this.spr.img,index * this.itemWidth,strip * this.itemHeight,
			this.itemWidth,this.itemHeight,
			x,y,
			-this.itemWidth / 2,-this.itemHeight / 2 )
		
		this.ctx.rotate( -angle )
		this.ctx.translate( -xMove,-yMove )
	}
	
	DrawScaled( x,y,strip,index,xScale,yScale,gfx,flipped = false )
	{
		if( flipped )
		{
			gfx.ctx.translate( x + this.itemWidth * xScale,y )
			gfx.ctx.scale( -1,1 )
				
			gfx.ctx.drawImage( this.spr.img,index * this.itemWidth,strip * this.itemHeight,
				this.itemWidth,this.itemHeight,
				0,0,
				this.itemWidth * xScale,this.itemHeight * yScale )
			
			gfx.ctx.scale( -1,1 )
			gfx.ctx.translate( -( x + this.itemWidth * xScale ),-y )
		}
		else
		{
			gfx.ctx.drawImage( this.spr.img,index * this.itemWidth,strip * this.itemHeight,
				this.itemWidth,this.itemHeight,
				x,y,
				this.itemWidth * xScale,this.itemHeight * yScale )
		}
	}
	
	DrawTile( x,y,strip,index,gfx,flipped = false )
	{
		const safetyStart = -0.01
		const safetyExpand = 1.02
		
		if( flipped )
		{
			// gfx.ctx.save()
			gfx.ctx.translate( x + this.itemWidth,y )
			gfx.ctx.scale( -1,1 )
			
			// gfx.ctx.drawImage( this.img,index * this.itemWidth,strip * this.itemHeight,
			// 	this.itemWidth,this.itemHeight,
			// 	x - gfx.width + this.itemWidth,y,
			// 	-this.itemWidth,this.itemHeight )
				
			gfx.ctx.drawImage( this.spr.img,index * this.itemWidth,strip * this.itemHeight,
				this.itemWidth,this.itemHeight,
				safetyStart,safetyStart,
				this.itemWidth * safetyExpand,this.itemHeight * safetyExpand )
			
			// gfx.ctx.restore()
			gfx.ctx.scale( -1,1 )
			gfx.ctx.translate( -( x + this.itemWidth ),-y )
		}
		else
		{
			gfx.ctx.drawImage( this.spr.img,index * this.itemWidth,strip * this.itemHeight,
				this.itemWidth,this.itemHeight,
				x + safetyStart,y + safetyStart,
				this.itemWidth * safetyExpand,this.itemHeight * safetyExpand )
		}
	}
	
	// certain decimal values make the clipping have a line on the edge
	// & if we round the movement is jagged
	// jk this happens no matter what, idk how to solve this other than adding 1px buffer in img
	GetPixelSafeX( x,flipped )
	{
		let scaled = x - Math.floor( x ) // get decimal
		scaled *= 10 // move decimal to 1s place
		if( scaled < 1 )
		{
			return( Math.floor( x ) )
		}
		else
		{
			scaled = Math.floor( scaled ) // get 1st  digit
			scaled /= 10 // return to normal, now we should have 0.x
			
			if( flipped )
			{
				if( Utils.RoughlyEquals( scaled,0.1 ) ||
					Utils.RoughlyEquals( scaled,0.3 ) ||
					Utils.RoughlyEquals( scaled,0.6 ) ||
					Utils.RoughlyEquals( scaled,0.8 ) )
				{
					scaled += 0.1
				}
			}
			else if( Utils.RoughlyEquals( scaled,0.2 ) ||
				Utils.RoughlyEquals( scaled,0.4 ) ||
				Utils.RoughlyEquals( scaled,0.7 ) ||
				Utils.RoughlyEquals( scaled,0.9 ) )
			{
				scaled += 0.1
			}
			
			return( Math.floor( x ) + scaled )
		}
	}
	
	GetPixelSafeY( y )
	{
		let scaled = y - Math.floor( y ) // get decimal
		scaled *= 10 // move decimal to 1s place
		if( scaled < 1 )
		{
			return( Math.floor( y ) )
		}
		else
		{
			scaled = Math.floor( scaled ) // get 1st  digit
			scaled /= 10 // return to normal, now we should have 0.x
			
			if( Utils.RoughlyEquals( scaled,0.1 ) ||
				Utils.RoughlyEquals( scaled,0.3 ) ||
				Utils.RoughlyEquals( scaled,0.6 ) ||
				Utils.RoughlyEquals( scaled,0.8 ) )
			{
				scaled += 0.1
			}
			
			return( Math.floor( y ) + scaled )
		}
	}
	
	GetItemSize()
	{
		return( this.itemSize )
	}
}