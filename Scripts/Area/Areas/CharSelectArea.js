class CharSelectArea extends Area
{
	GenerateMap( map,entities )
	{
		const layout = CharSelectArea.Layout
		const width = layout[0].length
		const height = layout.length
		this.dummySpots = []
		const attackTiles = []
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
					tile = 6
				case '6':
					attackTiles.push( tileVec )
					map.SetTile( x,y,tile )
					break
				
				case ' ':
					tile = 0
				default:
					map.SetTile( x,y,tile )
					break
				}
			}
		}
		
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
}

// t = target dummy
CharSelectArea.Layout = [
	"1111111111111111111111111111",
	"1                44444444441",
	"1                44444444441",
	"1                66666666661",
	"1                66666666661",
	"1                66666666t61",
	"1                66666666661",
	"1                66666666t61",
	"1                66666666661",
	"1                66666666t61",
	"1                66666666661",
	"1                66666666661",
	"1                          1",
	"1                          1",
	"1                          1",
	"1                          1",
	"1                          1",
	"1                          1",
	"1                          1",
	"1111111111111111111111111111"
]