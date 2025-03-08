class CharSelectArea extends Area
{
	GenerateMap( map,entities )
	{
		const layout = CharSelectArea.Layout
		const width = layout[0].length
		const height = layout.length
		this.dummySpots = []
		const attackTiles = []
		this.playerSpots = []
		this.ghostSpots = []
		for( let y = 0; y < height; ++y )
		{
			for( let x = 0; x < width; ++x )
			{
				let tile = layout[y][x]
				const tileVec = new Vec2( x,y )
				const tilePos = tileVec.Copy().Scale( map.tileSize )
					.Add( Vec2.One().Scale( map.tileSize / 2 ) )
				switch( tile )
				{
				case 't':
					this.dummySpots.push( tilePos )
				case '-':
					attackTiles.push( tileVec )
					map.SetTile( x,y,8 )
					break
				
				case 'g':
					this.ghostSpots.push( tileVec )
					map.SetTile( x,y,2 )
					break
				
				case 'p':
					this.playerSpots.push( tileVec )
				case ' ':
					tile = 0
				default:
					map.SetTile( x,y,tile )
					break
				}
			}
		}
		
		Utils.ShuffleArr( this.ghostSpots )
		
		// set attack area based on tiles - this.attackArea
		this.attackArea = new Rect( 9999,-9999,9999,-9999 )
		for( const tile of attackTiles )
		{
			if( tile.x < this.attackArea.left ) this.attackArea.left = tile.x
			if( tile.x > this.attackArea.right ) this.attackArea.right = tile.x
			if( tile.y < this.attackArea.top ) this.attackArea.top = tile.y
			if( tile.y > this.attackArea.bot ) this.attackArea.bot = tile.y
		}
		++this.attackArea.right
		++this.attackArea.bot
		this.attackArea.Scale( map.tileSize )
		
		entities.push( new CharSelectEntity( map ) )
		entities.push( new StartButton( new Vec2( 182,70 ) ) )
	}
	
	GenerateEnemyWave( map )
	{
		const enemies = []
		for( const spot of this.dummySpots )
		{
			enemies.push( new TargetDummy( spot.Copy() ) )
		}
		return( enemies )
	}
	
	GenerateBoss( map,enemies )
	{
		const fakeBoss = new Enemy( new Vec2( -100,-100 ) )
		fakeBoss.hp = -1
		return( fakeBoss )
	}
	
	GetGhostTiles()
	{
		return( this.ghostSpots )
	}
	
	GetPlayerSpots()
	{
		return( this.playerSpots )
	}
}

// t = target dummy
// p = player spot
// g = potential ghost spot
// - = target practice area
CharSelectArea.Layout = [
	"1111111111111111111111111111",
	"1111111111111111111111111111",
	"1111111111111111111111111111",
	"1  1 p 1 p 144444          1",
	"1  1   1   144444          1",
	"1  6   3   344444          1",
	"1333   6   644444          1",
	"1     ------------         1",
	"1p    ------------         1",
	"1     -----t------         1",
	"1336  ------------         1",
	"1     --------t---         1",
	"1p    ------------1111111111",
	"1     ---t--------1111111111",
	"1336  ------------1111111111",
	"15555555          1111111111",
	"1gggggg5  6   6   1111111111",
	"1gggggg5  3   3   1111111111",
	"1gggggg5  1 p 1 p 1111111111",
	"1111111111111111111111111111"
]