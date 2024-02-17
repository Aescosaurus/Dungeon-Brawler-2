class Area
{
	constructor( nWaves,tileSheet )
	{
		this.nWaves = nWaves
		this.tileSheet = new SprSheet( new Sprite( tileSheet ),8,8 )
		
		this.curWave = 0
	}
	
	GenerateMap( map )
	{
		map.CreateWalledEmptyMap()
	}
	
	GenerateBossMap( map )
	{
		map.CreateWalledEmptyMap()
	}
	
	GenerateEnemyWave( nEnemies,map )
	{
		const enemies = []
		for( let i = 0; i < nEnemies; ++i )
		{
			const spawnPos = map.Tile2WorldPos( map.GetRandEmptyTilePos() )
				.Add( Vec2.One().Scale( 4 ) )
			
			enemies.push( new Enemy( spawnPos ) )
		}
		
		++this.curWave
		
		return( enemies )
	}
	
	GenerateBoss( map )
	{
		return( new Boss( map.Tile2WorldPos( map.GetCenterTile() ) ) )
	}
	
	GetTileSheet()
	{
		return( this.tileSheet )
	}
	
	GetCurWave()
	{
		return( this.curWave )
	}
	
	GetBossWave()
	{
		return( this.nWaves )
	}
}