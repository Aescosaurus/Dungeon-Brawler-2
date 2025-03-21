class TavernArea extends Area
{
	GenerateMap( map,entities )
	{
		map.CreateWalledEmptyMap()
		for( let x = 1; x < map.width - 1; ++x ) map.SetTile( x,map.height - 1,7 )
		
		function CheckAreaFree( checkX,checkY )
		{
			for( let y = checkY - 1; y <= checkY + 1; ++y )
			{
				for( let x = checkX - 1; x <= checkX + 1; ++x )
				{
					if( !map.GetTile( x,y ) == 0 ) return( false )
				}
			}
			
			return( true )
		}
		
		// const nDecos = Utils.RandInt( 3,10 )
		// for( let i = 0; i < 10; ++i )
		// {
		// 	map.SetTile( Utils.RandInt( 1,map.width - 1 ),Utils.RandInt( 1,map.height - 1 ),
		// 		Utils.RandEvenInt( 4,7 ) )
		// }
		
		// free space in center so boss doesn't get blocked
		const bossFreeArea = 2 // radius
		const mapCenter = map.GetCenterTile()
		const bossCenterRect = Rect.CreateXYWH( mapCenter.x - bossFreeArea,mapCenter.y - bossFreeArea,
			bossFreeArea * 2,bossFreeArea * 2 )
		this.bossCenterTiles = bossCenterRect.GetAreaTiles()
		for( const tile of this.bossCenterTiles ) map.SetTile( tile.x,tile.y,2 )
		this.bossCenterEdge = bossCenterRect.GetEdgeTiles()
		for( const tile of this.bossCenterEdge ) map.SetTile( tile.x,tile.y,3 )
		
		const nObstacles = Utils.RandInt( 5,25 )
		for( let i = 0; i < nObstacles; ++i )
		{
			const randX = Utils.RandInt( 1,map.width - 1 )
			const randY = Utils.RandInt( 1,map.height - 1 )
			if( CheckAreaFree( randX,randY ) ) map.SetTile( randX,randY,Utils.RandOddInt( 2,6 ) )
		}
		
		// place chairs next to tables
		for( let y = 1; y < map.height - 1; ++y )
		{
			for( let x = 1; x < map.width - 1; ++x )
			{
				if( map.GetTile( x,y ) == 3 )
				{
					const dirs = Utils.ShuffleArr( Vec2.Cardinals() )
					const chairChances = [ 0.9,0.6,0.3,0.1 ]
					// chance to spawn chairs around table
					for( let i = 0; i < 4; ++i )
					{
						if( Math.random() < chairChances[i] )
						{
							if( map.GetTile( x + dirs[i].x,y + dirs[i].y ) == 0 )
							{
								map.SetTile( x + dirs[i].x,y + dirs[i].y,6 )
							}
						}
					}
				}
			}
		}
		
		this.barkeepEntity = new BarkeepEntity( map.Tile2WorldPosCentered( mapCenter ) )
		entities.push( this.barkeepEntity )
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
		
		return( enemies )
	}
	
	SpawnSingleEnemy( type,pos )
	{
		switch( type )
		{
		case 0: return( new TavernBrawler( pos ) )
		case 1: return( new LivingWineBottle( pos ) )
		}
	}
	
	GenerateBoss( map )
	{
		for( const tile of this.bossCenterEdge ) map.SetTile( tile.x,tile.y,0 )
		
		this.barkeepEntity.hp = -1
		
		return( new Barkeep( this.barkeepEntity.pos ) )
	}
}