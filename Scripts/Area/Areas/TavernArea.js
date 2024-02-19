class TavernArea extends Area
{
	GenerateMap( map )
	{
		map.CreateWalledEmptyMap()
		
		const rectSize = new Vec2( map.width,map.height )
			.Scale( 1 / 5 ).Floor()
		
		const allCounterRects = []
		for( let y = 2; y < map.height - rectSize.y; y += rectSize.y )
		{
			for( let x = 2; x < map.width - rectSize.x; x += rectSize.x )
			{
				allCounterRects.push( Rect.CreateXYWH( x,y,rectSize.x - 2,rectSize.y - 2 ) )
			}
		}
		const counterRects = allCounterRects
		
		Utils.ShuffleArr( counterRects )
		
		const nCounters = Utils.RandInt( 4,7 )
		const counterSizeRange = new Range( 3,9 )
		for( let i = 0; i < nCounters; ++i )
		{
			this.GenerateCounter( map,counterRects[i],counterSizeRange.GetRandVal() )
		}
	}
	
	GenerateCounter( map,rect,size )
	{
		const edges = rect.GetEdgeArrs()
		Utils.ShuffleArr( edges )
		const usedEdgeTiles = []
		for( let i = 0; i < 2; ++i )
		{
			for( const tile of edges[i] ) usedEdgeTiles.push( tile )
		}
		
		usedEdgeTiles.splice( size,usedEdgeTiles.length - size )
		
		if( Utils.Choose() )
		{
			for( const tile of usedEdgeTiles )
			{
				map.SetTileWall( tile.x,tile.y )
			}
		}
		else // use inverse tiles
		{
			const allTiles = rect.GetAreaTiles()
			for( const tile of allTiles )
			{
				let includes = false
				for( const item of usedEdgeTiles )
				{
					if( item.Equals( tile ) )
					{
						includes = true
						break
					}
				}
				
				if( !includes ) map.SetTileWall( tile.x,tile.y )
			}
		}
	}
	
	GenerateEnemyWave( map )
	{
		const enemies = []
		
		switch( this.curWave )
		{
		case 0:
			this.SpawnEnemies( 0,3,enemies,map )
			break
		case 1:
			this.SpawnEnemies( 0,3,enemies,map )
			this.SpawnEnemies( 1,2,enemies,map )
			break
		case 2:
			this.SpawnEnemies( 0,4,enemies,map )
			this.SpawnEnemies( 1,3,enemies,map )
			break
		}
		
		++this.curWave
		
		return( enemies )
	}
	
	SpawnEnemies( type,amount,enemyList,map )
	{
		for( let i = 0; i < amount; ++i )
		{
			const spawnPos = map.Tile2WorldPos( map.GetRandEmptyTilePos() )
				.Add( Vec2.One().Scale( 4 ) )
			let enemy = null
			switch( type )
			{
			case 0:
				enemy = new TavernBrawler( spawnPos )
				break
			case 1:
				enemy = new LivingWineBottle( spawnPos )
				break
			default:
				enemy = new Enemy( spawnPos )
				break
			}
			
			enemyList.push( enemy )
		}
	}
	
	GenerateBoss( map )
	{
		return( new Barkeep( map.Tile2WorldPos( map.GetCenterTile() ) ) )
	}
}