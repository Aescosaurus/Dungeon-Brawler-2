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
		this.bossPos = map.Tile2WorldPosCentered( bossSquare.GetCenter() )
		// todo: spawn boss as neutral entity from start, slowly firing bullets until activated
		
		for( let i = 0; i < nForests; ++i )
		{
			const square = randSquares[i]
			const edgeTiles = Utils.ShuffleArr( square.GetEdgeTiles() )
			const curve = this.GenerateCurve( edgeTiles[0],edgeTiles[1],
				square.GetRandPos(),square.GetRandPos(),map )
			for( const tile of curve ) map.SetTile( tile.x,tile.y,1 )
		}
		
		this.treeEntity = new BigTreeEntity( this.bossPos )
		entities.push( this.treeEntity )
	}
	
	GenerateEnemyWave( map )
	{
		const enemies = []
		
		switch( this.curWave )
		{
		case 0:
			this.SpawnEnemies( 0,2,enemies,map )
			if( Math.random() < 0.4 ) this.SpawnEnemies( 0,3,enemies,map )
			else this.SpawnEnemies( 1,4,enemies,map )
			break
		case 1:
			this.SpawnEnemies( 0,3,enemies,map )
			this.SpawnEnemies( 2,2,enemies,map )
			break
		case 2:
			this.SpawnEnemies( 0,2,enemies,map )
			this.SpawnEnemies( 2,4,enemies,map )
			this.SpawnEnemies( 3,1,enemies,map )
			break
		case 3:
			this.SpawnEnemies( 2,4,enemies,map )
			this.SpawnEnemies( 3,4,enemies,map )
			break
		}
		
		return( enemies )
	}
	
	SpawnSingleEnemy( type,pos )
	{
		switch( type )
		{
		case 0: return( new EvilMushroom( pos ) )
		case 1: return( new Thief( pos ) )
		case 2: return( new Wolf( pos ) )
		case 3: return( new LivingTree( pos ) )
		}
	}
	
	GenerateBoss( map,enemies )
	{
		this.treeEntity.hp = -1
		
		return( new BigTreeBoss( this.treeEntity.pos.Copy() ) )
	}
}