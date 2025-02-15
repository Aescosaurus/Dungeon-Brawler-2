class OrchardArea extends Area
{
	GenerateMap( map )
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
			map.SetTile( tile.x,tile.y,tileType )
		}
		
		const nDecos = Utils.RandInt( 5,16 )
		const emptyTiles = map.GetEmptyTileList()
		Utils.ShuffleArr( emptyTiles )
		for( let i = 0; i < nDecos; ++i ) map.SetTile( emptyTiles[i].x,emptyTiles[i].y,4 )
	}
	
	// cubic bezier curve
	GenerateCurve( startPos,endPos,ctrl1,ctrl2,map )
	{
		const curve = []
		const step = 0.00001
		for( let i = 0; i < 1 + step; i += step )
		{
			const x = Math.round( Math.pow( 1 - i,3 ) * startPos.x + 3 * Math.pow( 1 - i,2 ) * i * ctrl1.x +
				3 * ( 1 - i ) * i * i * ctrl2.x + i * i * i * endPos.x )
			const y = Math.round( Math.pow( 1 - i,3 ) * startPos.y + 3 * Math.pow( 1 - i,2 ) * i * ctrl1.y +
				3 * ( 1 - i ) * i * i * ctrl2.y + i * i * i * endPos.y )
			
			if( map.IsTileOnScreen( x,y ) ) curve.push( new Vec2( x,y ) )
		}
		
		return( curve )
	}
	
	GenerateEnemyWave( map )
	{
		const enemies = []
		
		enemies.push( new LivingCarrot( this.GetRandEnemySpawnPos( map ) ) )
		
		return( enemies )
	}
	
	// GenerateBoss( map,enemies )
	// {
	// 	for( const spot of this.bottleSpots )
	// 	{
	// 		map.SetTile( spot.x,spot.y,6 )
	// 		enemies.push( new LivingWineBottle( map.Tile2WorldPos( spot ).Add( Vec2.One().Scale( 4 ) ) ) )
	// 	}
	// 	return( new BanditChief( map.Tile2WorldPos( map.GetCenterTile() ) ) )
	// }
}