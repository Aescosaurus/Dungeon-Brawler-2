class Area
{
	constructor( nWaves,tileSheet )
	{
		this.nWaves = nWaves
		this.tileSheet = new SprSheet( new Sprite( tileSheet ),8,8 )
		
		this.attackArea = new Rect( -100,9999,-100,9999 )
		
		this.curWave = 0
	}
	
	GenerateMap( map,entities )
	{
		map.CreateWalledEmptyMap()
	}
	
	GenerateBossMap( map )
	{
		// map.CreateWalledEmptyMap()
	}
	
	GenerateEnemyWave( map )
	{
		const enemies = []
		for( let i = 0; i < 3; ++i )
		{
			const spawnPos = map.Tile2WorldPos( map.GetRandEmptyTilePos() )
				.Add( Vec2.One().Scale( 4 ) )
			
			enemies.push( new Enemy( spawnPos ) )
		}
		
		++this.curWave
		
		return( enemies )
	}
	
	SpawnEnemies( type,amount,enemyList,map )
	{
		for( let i = 0; i < amount; ++i ) enemyList.push( this.SpawnSingleEnemy( type,this.GetRandEnemySpawnPos( map ) ) )
	}
	
	SpawnSingleEnemy( type,pos )
	{
		console.log( "Spawn enemy not overridden!" )
		console.trace()
	}
	
	GenerateBoss( map )
	{
		return( new Boss( map.Tile2WorldPos( map.GetCenterTile() ) ) )
	}
	
	IncrementWave()
	{
		++this.curWave
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
	
	GetRandEnemySpawnPos( map )
	{
		return( map.Tile2WorldPos( map.GetRandEmptyTilePos() )
			.Add( Vec2.One().Scale( 4 ) ) )
	}
	
	GetAttackArea()
	{
		return( this.attackArea )
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
}