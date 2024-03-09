class CastleArea extends Area
{
	GenerateMap( map )
	{
		map.CreateWalledEmptyMap()
		
		const nRandTiles = 15
		for( let i = 0; i < nRandTiles; ++i )
		{
			map.SetTile( Utils.RandInt( 1,map.width - 1 ),
				Utils.RandInt( 1,map.height - 1 ),1 )
		}
	}
	
	GenerateBossMap( map )
	{
		map.CreateWalledEmptyMap()
	}
	
	GenerateEnemyWave( map )
	{
		const nEnemies = ( this.curWave + 1 ) * 3
		const enemies = []
		for( let i = 0; i < nEnemies; ++i )
		{
			const spawnPos = map.Tile2WorldPos( map.GetRandEmptyTilePos() )
				.Add( Vec2.One().Scale( 4 ) )
			let enemy = null
			if( this.curWave == 0 ) enemy = new Skeleton( spawnPos )
			else if( this.curWave == 1 ) enemy = new Vampire( spawnPos )
			else if( this.curWave == 2 ) enemy = new Imp( spawnPos )
			else
			{
				var rng = Utils.RandInt( 0,3 )
				if( rng == 0 ) enemy = new Skeleton( spawnPos )
				else if( rng == 1 ) enemy = new Vampire( spawnPos )
				else enemy = new Imp( spawnPos ) 
			}
			
			enemies.push( enemy )
		}
		
		return( enemies )
	}
	
	GenerateBoss( map )
	{
		return( new DarkHorse( map.Tile2WorldPos( map.GetCenterTile() ) ) )
	}
}