class Map
{
	constructor( gfx )
	{
		this.tiles = []
		
		this.tileSize = gfx.tileSize
		
		this.width = gfx.width / this.tileSize
		this.height = gfx.height / this.tileSize
		
		// if( this.width % 1 != 0 || this.height % 1 != 0 )
		if( this.width - Math.floor( this.width ) > 0 ||
			this.height - Math.floor( this.height ) > 0 )
		{
			throw new Error( "Invalid gfx screen size! width: " + this.width + " height: " + this.height )
		}
		
		this.edgeRect = new Rect( 0,this.height,0,this.width )
		
		this.tileSprSht = new SprSheet( new Sprite( "Images/Tiles/DungeonTiles.png" ),8,8 )
		
		// this.GenerateMap()
		this.ClearTiles()
		
		// console.log( this.width + " " + this.height )
	}
	
	Draw( gfx )
	{
		for( let y = 0; y < this.height; ++y )
		{
			for( let x = 0; x < this.width; ++x )
			{
				const tile = this.GetTile( x,y )
				// let col = "black"
				// if( tile == 1 ) col = "gray"
				// 
				// gfx.DrawRect( x * this.tileSize,y * this.tileSize,
				// 	this.tileSize,this.tileSize,
				// 	col )
				const strip = Math.floor( tile / 2 )
				this.tileSprSht.DrawTile( x * this.tileSize,y * this.tileSize,
					strip,tile - strip * 2,gfx )
			}
		}
	}
	
	GenerateMap()
	{
		this.tiles = []
		
		for( let i = 0; i < this.width * this.height; ++i ) this.tiles.push( 0 )
		
		for( let y = 0; y < this.height; ++y ) this.SetTile( 0,y,1 )
		for( let y = 0; y < this.height; ++y ) this.SetTile( this.width - 1,y,1 )
		for( let x = 0; x < this.width; ++x ) this.SetTile( x,0,1 )
		for( let x = 0; x < this.width; ++x ) this.SetTile( x,this.height - 1,1 )
		
		const nRandTiles = 15
		for( let i = 0; i < nRandTiles; ++i )
		{
			this.SetTile( Utils.RandInt( 1,this.width - 1 ),
				Utils.RandInt( 1,this.height - 1 ),1 )
		}
	}
	
	CreateWalledEmptyMap()
	{
		for( let y = 0; y < this.height; ++y ) this.SetTile( 0,y,1 )
		for( let y = 0; y < this.height; ++y ) this.SetTile( this.width - 1,y,1 )
		for( let x = 0; x < this.width; ++x ) this.SetTile( x,0,1 )
		for( let x = 0; x < this.width; ++x ) this.SetTile( x,this.height - 1,1 )
		
		for( let y = 1; y < this.height - 1; ++y )
		{
			for( let x  = 1; x < this.width - 1; ++x )
			{
				this.SetTile( x,y,0 )
			}
		}
	}
	
	ClearTiles()
	{
		this.tiles = []
		
		for( let i = 0; i < this.width * this.height; ++i ) this.tiles.push( 0 )
	}
	
	SetTileSprSht( newSprSht )
	{
		this.tileSprSht = newSprSht
	}
	
	SetTile( x,y,tile )
	{
		if( !this.IsTileOnScreen( x,y ) ) throw new Error( "Tile not on screen! x: " + x + " y: " + y )
		
		this.tiles[y * this.width + x] = tile
	}
	
	SetTileFloor( x,y )
	{
		this.SetTile( x,y,0 )
	}
	
	SetTileWall( x,y )
	{
		this.SetTile( x,y,1 )
	}
	
	StepOnTile( x,y )
	{
		if( this.GetTile( x,y ) == 4 ) this.SetTile( x,y,2 )
	}
	
	GetTile( x,y )
	{
		if( !this.IsTileOnScreen( x,y ) ) throw new Error( "Tile not on screen! x: " + x + " y: " + y )
		
		return( this.tiles[y * this.width + x] )
	}
	
	IsTileOnScreen( x,y )
	{
		return( x >= 0 && x < this.width && y >= 0 && y < this.height )
	}
	
	World2TilePos( worldPos )
	{
		return( worldPos.Copy().Divide( this.tileSize ).Floor() )
	}
	
	Tile2WorldPos( tilePos )
	{
		return( tilePos.Copy().Scale( this.tileSize ).Floor() )
	}
	Tile2WorldPosCentered( tilePos )
	{
		return( this.Tile2WorldPos( tilePos ).Add( Vec2.One().Scale( this.tileSize / 2 ) ) )
	}
	
	IsWalkableTile( x,y )
	{
		return( this.GetTile( x,y ) % 2 == 0 )
	}
	
	GetRandTilePos()
	{
		return( new Vec2( Utils.RandInt( 0,this.width ),Utils.RandInt( 0,this.height ) ) )
	}
	
	GetEmptyTileList()
	{
		const tiles = []
		
		for( let y = 0; y < this.height; ++y )
		{
			for( let x = 0; x < this.width; ++x )
			{
				// use this instead of IsWalkableTile so we don't spawn in areas we shouldn't
				//  (in town area for example)
				if( this.GetTile( x,y ) == 0 ) tiles.push( new Vec2( x,y ) )
			}
		}
		
		return( tiles )
	}
	
	GetRandEmptyTilePos()
	{
		const tiles = []
		
		for( let y = 0; y < this.height; ++y )
		{
			for( let x = 0; x < this.width; ++x )
			{
				// use this instead of IsWalkableTile so we don't spawn in areas we shouldn't
				//  (in town area for example)
				if( this.GetTile( x,y ) == 0 ) tiles.push( new Vec2( x,y ) )
			}
		}
		
		// tiles.sort( function( a,b ) { return( Utils.RandFloat( 0,1 ) - 0.5 ) } )
		Utils.ShuffleArr( tiles )
		
		return( tiles[0] )
	}
	
	GetCenterTile()
	{
		return( new Vec2( this.width,this.height ).Divide( 2 ).Floor() )
	}
	
	GetRandEdgeTile()
	{
		return( Utils.ArrayChooseRand( this.edgeRect.GetEdgeTiles() ) )
	}
	
	GetEdgeRect()
	{
		return( this.edgeRect )
	}
}