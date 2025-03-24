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
		
		mazeTiles[( mazeDims.y - 1 ) * mazeDims.x + Utils.RandInt( 0,mazeDims.x )].junctions[1] = true
		
		for( const mazeTile of mazeTiles )
		{
			const tileRect = Rect.CreateXYWH( 1 + mazeTile.x * horizInterval,
				mazeTile.y * vertInterval,horizInterval,vertInterval )
			
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
						entities.push( new TrapWall( map.Tile2WorldPosCentered( new Vec2( x,y ) ),
							Utils.ArrayChooseRand( airDirs ),map ) )
					}
				}
			}
		}
	}
}