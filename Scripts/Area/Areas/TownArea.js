class TownArea extends Area
{
	GenerateMap( map )
	{
		map.ClearTiles()
		
		const buildingRects = []
		const lengthRange = new Range( 3,7 )
		const heightRange = new Range( 0,4 )
		for( let x = -1; x < map.width; ++x )
		{
			const rect = new Rect( -1,heightRange.GetRandVal(),
				x + Utils.RandInt( -1,1 ),x + lengthRange.GetRandVal() )
			buildingRects.push( rect )
			x = rect.right
		}
		for( let x = -1; x < map.width; ++x )
		{
			const rect = new Rect( map.height - 1 - heightRange.GetRandVal(),map.height + 1,
				x + Utils.RandInt( -1,1 ),x + lengthRange.GetRandVal() )
			buildingRects.push( rect )
			x = rect.right
		}
		
		const bottleChance = 0.08
		for( const building of buildingRects )
		{
			const fillTiles = building.GetAreaTiles()
			for( const tile of fillTiles )
			{
				if( map.IsTileOnScreen( tile.x,tile.y ) )
				{
					map.SetTile( tile.x,tile.y,Math.random() < bottleChance ? 4 : 6 )
				}
			}
			const edgeArrs = building.GetEdgeArrs()
			for( let i = 0; i < edgeArrs.length; ++i )
			{
				const edge = edgeArrs[i]
				for( let j = 0; j < edge.length; ++j )
				{
					const tile = edge[j]
					if( map.IsTileOnScreen( tile.x,tile.y ) )
					{
						map.SetTile( tile.x,tile.y,i == 0 || i == 1 ? 3 : 1 )
					}
				}
			}
			// const edgeTiles = building.GetEdgeTiles()
			// for( const tile of edgeTiles )
			// {
			// 	if( map.IsTileOnScreen( tile.x,tile.y ) ) map.SetTile( tile.x,tile.y,1 )
			// }
			
			// todo: roof tiles to fill building.GetAreaTiles()
		}
		
		const yEdgeBuffer = heightRange.max + 1
		const edgeBuffer = 0
		const edgeWidth = 2
		this.mapEdges = [
			// new Rect( edgeBuffer,edgeWidth + edgeBuffer,edgeBuffer,map.width - edgeBuffer ), // top
			// new Rect( map.height - edgeWidth - edgeBuffer,map.height - edgeBuffer,edgeBuffer,map.width - edgeBuffer ), // bot
			new Rect( yEdgeBuffer,map.height - yEdgeBuffer,edgeBuffer,edgeWidth + edgeBuffer ), // left
			new Rect( yEdgeBuffer,map.height - yEdgeBuffer,map.width - edgeWidth - edgeBuffer,map.width - edgeBuffer ) // right
		]
	}
	
	GenerateBossMap( map,enemies )
	{
		this.bottleSpots = []
		for( let y = 0; y < map.height; ++y )
		{
			for( let x = 0; x < map.width; ++x )
			{
				const tile = map.GetTile( x,y )
				if( tile == 3 ) map.SetTile( x,y,6 )
				else if( tile == 4 ) this.bottleSpots.push( new Vec2( x,y ) )
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
			this.SpawnEnemies( 0,2,enemies,map )
			this.SpawnEnemies( 1,2,enemies,map )
			break
		case 2:
			this.SpawnEnemies( 0,4,enemies,map )
			this.SpawnEnemies( 1,2,enemies,map )
			this.SpawnEnemies( 2,1,enemies,map )
			break
		case 3:
			this.SpawnEnemies( 0,4,enemies,map )
			this.SpawnEnemies( 1,3,enemies,map )
			this.SpawnEnemies( 2,3,enemies,map )
			break
		}
		
		return( enemies )
	}
	
	// spawn archers around edge, thief on left & warrior on right
	SpawnEnemies( type,amount,enemyList,map )
	{
		for( let i = 0; i < amount; ++i )
		{
			enemyList.push( this.SpawnSingleEnemy( type,map.Tile2WorldPos(
				this.mapEdges[Utils.RandInt( 0,this.mapEdges.length )]
				.GetRandPos() ).Add( Vec2.One().Scale( 4 ) ) ) )
		}
	}
	
	SpawnSingleEnemy( type,pos )
	{
		switch( type )
		{
		case 0: return( new BanditArcher( pos ) )
		case 1: return( new Thief( pos ) )
		case 2: return( new BanditWarrior( pos ) )
		}
	}
	
	GenerateBoss( map,enemies )
	{
		for( const spot of this.bottleSpots )
		{
			map.SetTile( spot.x,spot.y,6 )
			enemies.push( new LivingWineBottle( map.Tile2WorldPos( spot ).Add( Vec2.One().Scale( 4 ) ) ) )
		}
		return( new BanditChief( map.Tile2WorldPos( map.GetCenterTile() ) ) )
	}
}