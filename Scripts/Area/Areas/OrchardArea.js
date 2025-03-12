class OrchardArea extends Area
{
	GenerateMap( map,entities )
	{
		map.ClearTiles()
		map.CreateWalledEmptyMap()
		
		// use bezier curves to make river & road
		// road coming from city, so it's those tiles
		// where they intersect, add a bridge
		// add at least 1 extra bridge no matter what, so you are guaranteed to have a way to cross
		
		const edgeArrs = map.GetEdgeRect().GetEdgeArrs()
		// this.GenerateCurve( map.GetRandEdgeTile(),map.GetRandEdgeTile(),
		// 	map.GetRandTilePos(),map.GetRandTilePos(),
		// 	3,map )
		const nRivers = 2
		for( let i = 0; i < nRivers; ++i )
		{
			const riverCurve = this.GenerateCurve(
				Utils.ArrayChooseRand( edgeArrs[0] ),Utils.ArrayChooseRand( edgeArrs[1] ),
				map.GetRandTilePos(),map.GetRandTilePos(),map )
			for( const tile of riverCurve ) map.SetTile( tile.x,tile.y,3 )
		}
		const roadCurve = this.GenerateCurve(
			Utils.ArrayChooseRand( edgeArrs[2] ),Utils.ArrayChooseRand( edgeArrs[3] ),
			map.GetRandTilePos(),map.GetRandTilePos(),map )
		for( const tile of roadCurve )
		{
			const mapTile = map.GetTile( tile.x,tile.y )
			if( mapTile == 8 ) continue
			let tileType = 6
			if( mapTile == 3 ) tileType = 8
			if( map.IsTileOnScreen( tile.x,tile.y ) ) map.SetTile( tile.x,tile.y,tileType )
			if( map.IsTileOnScreen( tile.x,tile.y - 1 ) ) map.SetTile( tile.x,tile.y - 1,tileType )
			// if( map.IsTileOnScreen( tile.x,tile.y + 1 ) ) map.SetTile( tile.x,tile.y + 1,tileType )
		}
		
		const unconnected = this.FindUnconnectedTiles( map )
		Utils.ShuffleArr( unconnected )
		for( let i = 0; i < unconnected.length - 1; ++i )
		{
			const curGroup = unconnected[i]
			const nextGroup = unconnected[i + 1]
			
			const curve = this.GenerateCurve(
				Utils.ArrayChooseRand( curGroup ),
				Utils.ArrayChooseRand( nextGroup ),
				map.GetRandTilePos(),map.GetRandTilePos(),map )
			for( const tile of curve )
			{
				if( !map.IsWalkableTile( tile.x,tile.y ) ) map.SetTile( tile.x,tile.y,8 )
				if( !map.IsWalkableTile( tile.x,tile.y - 1 ) ) map.SetTile( tile.x,tile.y - 1,8 )
				// if( !map.IsWalkableTile( tile.x,tile.y + 1 ) ) map.SetTile( tile.x,tile.y + 1,8 )
			}
		}
		
		const nDecos = Utils.RandInt( 5,16 )
		const emptyTiles = map.GetEmptyTileList()
		Utils.ShuffleArr( emptyTiles )
		for( let i = 0; i < nDecos; ++i ) map.SetTile( emptyTiles[i].x,emptyTiles[i].y,4 )
		
		// find largest unconnected, then put boss at center of random free 3x3 area
		let largestUnconnected = -1
		let largestIndex = 0
		for( let i = 0; i < unconnected.length; ++i )
		{
			const curLen = unconnected[i].length
			if( curLen > largestUnconnected )
			{
				largestUnconnected = curLen
				largestIndex = i
			}
		}
		const bossSpots = []
		for( let y = 3; y < map.height - 5; ++y )
		{
			for( let x = 3; x < map.width - 5; ++x )
			{
				let valid = true
				for( let yy = y - 2; yy < y + 4; ++yy )
				{
					for( let xx = x - 2; xx < x + 4; ++xx )
					{
						const curTile = map.GetTile( xx,yy )
						if( !( curTile == 0 || curTile == 4 ) )
						{
							valid = false
							xx = x + 6;
							yy = y + 6;
						}
					}
				}
				
				if( valid )
				{
					bossSpots.push( new Vec2( x,y ) )
				}
			}
		}
		if( bossSpots.length < 1 ) bossSpots.push( map.Tile2WorldPos( map.GetCenterTile() ) )
		this.bossEntity = new GrowingPumpkinEntity( Utils.ArrayChooseRand( bossSpots )
			.Copy().Scale( map.tileSize ).Add( new Vec2( 4,4 ) ) )
		entities.push( this.bossEntity )
	}
	
	FindUnconnectedTiles( map )
	{
		function AddConnectedTiles( pos,arr,existing )
		{
			if( Utils.ArrayContains( existing,pos,function( a,b )
				{
					return( a.Equals( b ) )
				} ) )
			{
				return
			}
			
			if( map.IsWalkableTile( pos.x,pos.y ) )
			{
				arr.push( pos.Copy() )
				existing.push( pos.Copy() )
				const dirs = Vec2.Cardinals()
				for( const dir of dirs )
				{
					const checkPos = pos.Copy().Add( dir )
					
					if( checkPos.x >= 0 && checkPos.x < map.width &&
						checkPos.y >= 0 && checkPos.y < map.height )
					{
						AddConnectedTiles( checkPos,arr,existing )
					}
				}
			}
		}
		
		const groups = []
		const coveredTiles = []
		
		for( let y = 0; y < map.height; ++y )
		{
			for( let x = 0; x < map.width; ++x )
			{
				const curPos = new Vec2( x,y )
				if( map.IsWalkableTile( x,y ) &&
					!Utils.ArrayContains( coveredTiles,curPos,function( a,b )
					{
						return( a.Equals( b ) )
					} ) )
				{
					groups.push( [] )
					AddConnectedTiles( curPos,groups[groups.length - 1],coveredTiles )
				}
			}
		}
		
		return( groups )
	}
	
	GenerateBossMap( map,enemies )
	{
		this.carrotSpots = []
		for( let y = 0; y < map.height; ++y )
		{
			for( let x = 0; x < map.width; ++x )
			{
				if( map.GetTile( x,y ) == 4 ) this.carrotSpots.push( new Vec2( x,y ) )
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
			this.SpawnEnemies( 0,1,enemies,map )
			this.SpawnEnemies( 1,3,enemies,map )
			this.SpawnEnemies( 2,1,enemies,map )
			break
		case 3:
			this.SpawnEnemies( 0,2,enemies,map )
			this.SpawnEnemies( 1,3,enemies,map )
			this.SpawnEnemies( 2,3,enemies,map )
			break
		}
		
		this.bossEntity.Grow()
		
		return( enemies )
	}
	
	SpawnSingleEnemy( type,pos )
	{
		switch( type )
		{
		case 0: return( new LivingCarrot( pos ) )
		case 1: return( new CabbageRoller( pos ) )
		case 2: return( new Scarecrow( pos ) )
		}
	}
	
	GenerateBoss( map,enemies )
	{
		for( const spot of this.carrotSpots )
		{
			map.SetTile( spot.x,spot.y,0 )
			enemies.push( new LivingCarrot( map.Tile2WorldPos( spot ).Add( Vec2.One().Scale( 4 ) ) ) )
		}
		
		this.bossEntity.hp = -1
		
		return( new GrowingPumpkinBoss( this.bossEntity.pos.Copy() ) )
	}
}