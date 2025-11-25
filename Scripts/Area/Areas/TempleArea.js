class TempleArea extends Area
{
	GenerateMap( map,entities )
	{
		map.CreateWalledEmptyMap()
		
		const horizInterval = 5
		const vertInterval = 5
		
		const mazeDims = new Vec2( map.width / horizInterval,map.height / vertInterval - 1 ).Floor()
		
		const mazeTiles = []
		for( let y = 0; y < mazeDims.y; ++y )
		{
			for( let x = 0; x < mazeDims.x; ++x )
			{
				mazeTiles.push( new Vec2( x,y ) )
				mazeTiles[mazeTiles.length - 1].junctions = [ false,false,false,false ]
				mazeTiles[mazeTiles.length - 1].visited = false
			}
		}
		const unvisited = []
		for( let i = 0; i < mazeTiles.length; ++i ) unvisited.push( i )
		Utils.ShuffleArr( unvisited )
		
		const startTile = Utils.ArrayChooseRand( mazeTiles )
		for( let i = 0; i < unvisited.length; ++i )
		{
			let curTarget = mazeTiles[unvisited[i]]
			let curTile = startTile
			if( !curTarget.visited )
			{
				while( !curTile.Equals( curTarget ) )
				{
					const curDir = curTarget.Copy().Subtract( curTile )
					curDir.x = Math.sign( curDir.x )
					curDir.y = Math.sign( curDir.y )
					if( curDir.x != 0 && curDir.y != 0 )
					{
						if( Math.random() < 0.5 ) curDir.x = 0
						else curDir.y = 0
					}
					
					let oppositeDirInd = -1
					if( curDir.Equals( Vec2.Up() ) )
					{
						curTile.junctions[0] = true
						oppositeDirInd = 1
					}
					else if( curDir.Equals( Vec2.Down() ) )
					{
						curTile.junctions[1] = true
						oppositeDirInd = 0
					}
					else if( curDir.Equals( Vec2.Left() ) )
					{
						curTile.junctions[2] = true
						oppositeDirInd = 3
					}
					else if( curDir.Equals( Vec2.Right() ) )
					{
						curTile.junctions[3] = true
						oppositeDirInd = 2
					}
					
					const nextPos = curTile.Copy().Add( curDir )
					curTile = mazeTiles[nextPos.y * mazeDims.x + nextPos.x]
					curTile.junctions[oppositeDirInd] = true
					curTile.visited = true
				}
			}
		}
		
		
		const topIdol = Utils.Choose()
		const topOffset = topIdol ? 4 : 0
		
		mazeTiles[( topIdol ? 0 : mazeDims.y - 1 ) * mazeDims.x + Utils.RandInt( 0,mazeDims.x )]
			.junctions[topIdol ? 0 : 1] = true
		
		const possibleBossLocs = []
		for( const mazeTile of mazeTiles )
		{
			const tileRect = Rect.CreateXYWH( 1 + mazeTile.x * horizInterval,
				topOffset + mazeTile.y * vertInterval,horizInterval,vertInterval )
			
			possibleBossLocs.push( tileRect.GetCenter() )
			
			const edgeArrs = tileRect.GetEdgeArrs()
			
			for( let i = 0; i < edgeArrs.length; ++i )
			{
				if( !mazeTile.junctions[i] )
				{
					for( const tile of edgeArrs[i] )
					{
						map.SetTile( tile.x,tile.y,1 )
					}
				}
			}
		}
		this.bossLoc = Utils.ArrayChooseRand( possibleBossLocs )
		
		this.trapTiles = []
		this.trapEntities = []
		
		const trapChance = 0.1
		const checkDirs = Vec2.Cardinals()
		for( let y = 0; y < map.height; ++y )
		{
			for( let x = 0; x < map.width; ++x )
			{
				if( map.GetTile( x,y ) == 1 )
				{
					const airDirs = []
					let nWalls = 0
					for( let i = 0; i < checkDirs.length; ++i )
					{
						const tilePos = new Vec2( x + checkDirs[i].x,y + checkDirs[i].y )
						if( map.IsTileOnScreen( tilePos.x,tilePos.y ) )
						{
							const tile = map.GetTile( tilePos.x,tilePos.y )
							if( tile == 0 ) airDirs.push( i )
							else if( tile == 1 ) ++nWalls
						}
					}
					
					if( airDirs.length > 0 && nWalls > 0 && Math.random() < trapChance )
					{
						const trapTile = new Vec2( x,y )
						const trapEntity = new TrapWall( map.Tile2WorldPosCentered( trapTile ),
							Utils.ArrayChooseRand( airDirs ),map )
						entities.push( trapEntity )
						this.trapEntities.push( trapEntity )
						this.trapTiles.push( trapTile )
					}
				}
			}
		}
	}
	
	GenerateEnemyWave( map )
	{
		const enemies = []
		
		switch( this.curWave )
		{
		case 0:
			this.SpawnEnemies( 1,3,enemies,map )
			break
		case 1:
			this.SpawnEnemies( 1,3,enemies,map )
			this.SpawnEnemies( 0,2,enemies,map )
			break
		case 2:
			this.SpawnEnemies( 1,2,enemies,map )
			this.SpawnEnemies( 0,1,enemies,map )
			this.SpawnEnemies( 2,2,enemies,map )
			break
		case 3:
			this.SpawnEnemies( 1,4,enemies,map )
			this.SpawnEnemies( 0,2,enemies,map )
			this.SpawnEnemies( 2,4,enemies,map )
			break
		}
		
		return( enemies )
	}
	
	SpawnSingleEnemy( type,pos )
	{
		switch( type )
		{
		case 0: return( new FrogBig( pos ) )
		case 1: return( new Basilisk( pos ) )
		case 2: return( new MaskedWarrior( pos ) )
		}
	}
	
	GenerateBoss( map,enemies )
	{
		for( const tile of this.trapTiles )
		{
			map.SetTile( tile.x,tile.y,0 )
			if( Math.random() < 0.5 )
			{
				enemies.push( new Basilisk( map.Tile2WorldPos( tile ).Add( Vec2.One().Scale( 4 ) ) ) )
			}
		}
		
		for( const trapEntity of this.trapEntities ) trapEntity.hp = -1
		
		return( new IdolBoulder( map.Tile2WorldPos( this.bossLoc ) ) )
	}
}