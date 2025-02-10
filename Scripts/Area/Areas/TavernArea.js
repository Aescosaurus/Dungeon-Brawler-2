class TavernArea extends Area
{
	GenerateMap( map )
	{
		map.CreateWalledEmptyMap()
		for( let x = 1; x < map.width - 1; ++x ) map.SetTile( x,map.height - 1,7 )
		
		function CheckAreaFree( checkX,checkY )
		{
			for( let y = checkY - 1; y <= checkY + 1; ++y )
			{
				for( let x = checkX - 1; x <= checkX + 1; ++x )
				{
					if( !map.IsWalkableTile( x,y ) ) return( false )
				}
			}
			
			return( true )
		}
		
		const nObstacles = Utils.RandInt( 5,25 )
		for( let i = 0; i < nObstacles; ++i )
		{
			const randX = Utils.RandInt( 1,map.width - 1 )
			const randY = Utils.RandInt( 1,map.height - 1 )
			if( CheckAreaFree( randX,randY ) ) map.SetTile( randX,randY,Utils.RandOddInt( 2,6 ) )
		}
	
		const nDecos = Utils.RandInt( 3,10 )
		for( let i = 0; i < 10; ++i )
		{
			map.SetTile( Utils.RandInt( 1,map.width - 1 ),Utils.RandInt( 1,map.height - 1 ),
				Utils.RandEvenInt( 4,7 ) )
		}
		
		// free space in center so boss doesn't get blocked
		const bossFreeArea = 2;
		const mapCenter = map.GetCenterTile()
		for( let y = mapCenter.y - bossFreeArea; y < mapCenter.y + bossFreeArea; ++y )
		{
			for( let x = mapCenter.x - bossFreeArea; x < mapCenter.x + bossFreeArea; ++x )
			{
				map.SetTile( x,y,0 )
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
		
		return( enemies )
	}
	
	SpawnEnemies( type,amount,enemyList,map )
	{
		for( let i = 0; i < amount; ++i )
		{
			const spawnPos = this.GetRandEnemySpawnPos( map )
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