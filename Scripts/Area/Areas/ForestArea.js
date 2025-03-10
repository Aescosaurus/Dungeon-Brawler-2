class ForestArea extends Area
{
	GenerateMap( map,entities )
	{
		map.CreateWalledEmptyMap()
		
		const nForests = Utils.RandInt( 3,7 )
		
		const squareSize = 3
		const xBuffer = 1
		const yBuffer = 2
		const randSquares = []
		for( let y = 2; y < map.height - 2 - squareSize; ++y )
		{
			let maxSquareY = 0
			for( let x = 2; x < map.width - 2 - squareSize; ++x )
			{
				randSquares.push( new Rect( y,y + squareSize,x,x + squareSize ) )
				x += squareSize + xBuffer
			}
			y += squareSize + yBuffer
		}
		
		Utils.ShuffleArr( randSquares )
		const bossSquare = randSquares.pop()
		const bossPos = bossSquare.GetCenter()
		// todo: spawn boss as neutral entity from start, slowly firing bullets until activated
		
		for( let i = 0; i < nForests; ++i )
		{
			const square = randSquares[i]
			const edgeTiles = Utils.ShuffleArr( square.GetEdgeTiles() )
			const curve = this.GenerateCurve( edgeTiles[0],edgeTiles[1],
				square.GetRandPos(),square.GetRandPos(),map )
			for( const tile of curve ) map.SetTile( tile.x,tile.y,1 )
		}
	}
	
	GenerateEnemyWave( map )
	{
		const enemies = []
		
		enemies.push( new EvilMushroom( this.GetRandEnemySpawnPos( map ) ) )
		
		return( enemies )
	}
}