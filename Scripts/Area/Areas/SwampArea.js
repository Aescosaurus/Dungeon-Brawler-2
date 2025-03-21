class SwampArea extends Area
{
	GenerateMap( map,entities )
	{
		map.CreateWalledEmptyMap()
		
		// for( let x = 0; x < map.width; ++x ) map.SetTile( x,0,Utils.RandOddInt( 1,8 ) )
		// for( let x = 0; x < map.width; ++x ) map.SetTile( x,map.height - 1,Utils.RandOddInt( 1,8 ) )
		// for( let y = 0; y < map.height; ++y ) map.SetTile( 0,y,Utils.RandOddInt( 1,8 ) )
		// for( let y = 0; y < map.height; ++y ) map.SetTile( map.width - 1,y,Utils.RandOddInt( 1,8 ) )
		
		for( let y = 1; y < map.height - 1; ++y )
		{
			for( let x = 1; x < map.width - 1; ++x )
			{
				if( Math.random() < 0.15 ) map.SetTile( x,y,6 )
			}
		}
		
		// spawn pockets of mushrooms around which mushroom enemies spawn
		//  these can overlap with edges
		const nMushroomPockets = Utils.RandInt( 2,5 )
		const mushroomChance = 0.4
		const edgeBuffer = 5
		this.enemySpawnLocs = []
		const maxCircleRad = 3 + 1
		const prevPockets = []
		for( let i = 0; i < nMushroomPockets; ++i )
		{
			const mushroomRad = Utils.RandInt( 1,3 ) // if you update this then update maxCircleRad too
			const enemySpawnRad = mushroomRad + 1
			let pocketPos = 0
			if( i == 0 ) // guaranteed to place 1st pocket
			{
				pocketPos = new Vec2( Utils.RandInt( edgeBuffer,map.width - edgeBuffer ),
					Utils.RandInt( edgeBuffer,map.height - edgeBuffer ) )
			}
			else
			{
				let tries = 100
				while( --tries > 0 )
				{
					pocketPos = new Vec2( Utils.RandInt( 0,map.width ),
						Utils.RandInt( 0,map.height ) )
					
					let spotFound = true
					for( const prevPocket of prevPockets )
					{
						const dist = prevPocket.Copy().Subtract( pocketPos ).GetLenSq()
						if( dist < Math.pow( maxCircleRad,2 ) )
						{
							spotFound = false
							break
						}
					}
					
					if( spotFound ) break
				}
				
				if( tries <= 1 )
				{
					i = nMushroomPockets
					break
				}
			}
			
			prevPockets.push( pocketPos )
			
			for( let y = pocketPos.y - enemySpawnRad; y <= pocketPos.y + enemySpawnRad; ++y )
			{
				for( let x = pocketPos.x - enemySpawnRad; x <= pocketPos.x + enemySpawnRad; ++x )
				{
					const diff = pocketPos.Copy().Subtract( new Vec2( x,y ) ).GetLenSq()
					if( map.IsTileOnScreen( x,y ) )
					{
						if( diff < Math.pow( mushroomRad,2 ) ||
							( diff == Math.pow( mushroomRad,2 ) && Math.random() < mushroomChance ) )
						{
							map.SetTile( x,y,Utils.RandOddInt( 2,8 ) )
						}
						else if( diff <= Math.pow( enemySpawnRad,2 ) )
						{
							this.enemySpawnLocs.push( new Vec2( x,y ) )
						}
					}
				}
			}
		}
		
		for( const tile of this.enemySpawnLocs ) map.SetTile( tile.x,tile.y,4 )
		
		// if baby mushroom is surrounded by 4 unwalkable, turn it into big mushroom & remove spawn loc
		for( let y = 0; y < map.height; ++y )
		{
			for( let x = 0; x < map.width; ++x )
			{
				if( map.GetTile( x,y ) == 4 )
				{
					let free = true
					if( ( !map.IsTileOnScreen( x,y - 1 ) || !map.IsWalkableTile( x,y - 1 ) ) &&
						( !map.IsTileOnScreen( x,y + 1 ) || !map.IsWalkableTile( x,y + 1 ) ) &&
						( !map.IsTileOnScreen( x - 1,y ) || !map.IsWalkableTile( x - 1,y ) ) &&
						( !map.IsTileOnScreen( x + 1,y ) || !map.IsWalkableTile( x + 1,y ) ) ) free = false
					
					if( !free )
					{
						map.SetTile( x,y,Utils.RandOddInt( 2,8 ) )
						for( let i = 0; i < this.enemySpawnLocs.length; ++i )
						{
							if( this.enemySpawnLocs[i].Equals( new Vec2( x,y ) ) )
							{
								this.enemySpawnLocs.splice( i,1 )
								break
							}
						}
					}
				}
			}
		}
		
		this.bossPos = prevPockets[0]
	}
	
	GenerateEnemyWave( map )
	{
		const enemies = []
		
		switch( this.curWave )
		{
		case 0:
			this.SpawnEnemies( 0,4,enemies,map )
			this.SpawnEnemies( 3,6,enemies,map )
			break
		case 1:
			this.SpawnEnemies( 3,8,enemies,map )
			this.SpawnEnemies( 2,3,enemies,map )
			break
		case 2:
			this.SpawnEnemies( 2,6,enemies,map )
			this.SpawnEnemies( 1,3,enemies,map )
			break
		}
		
		return( enemies )
	}
	
	SpawnSingleEnemy( type,pos )
	{
		switch( type )
		{
		case 0: return( new EvilMushroom( pos ) )
		case 1: return( new LivingTree( pos ) )
		case 2: return( new Frog( pos ) )
		case 3: return( new FlyEnemy( pos ) )
		}
	}
	
	GetRandEnemySpawnPos( map )
	{
		return( map.Tile2WorldPosCentered( Utils.ArrayChooseRand( this.enemySpawnLocs ) ) )
	}
	
	GenerateBoss( map,enemies )
	{
		for( let y = -1; y <= 1; ++y )
		{
			for( let x = -1; x <= 1; ++x )
			{
				map.SetTile( this.bossPos.x + x,this.bossPos.y + y,2 )
			}
		}
		
		const mushroomBoss = new GiantMushroomBoss( map.Tile2WorldPosCentered( this.bossPos ) )
		mushroomBoss.SetArea( this )
		
		return( mushroomBoss )
	}
}