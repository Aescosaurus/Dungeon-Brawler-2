class AreaManager
{
	constructor( gfx )
	{
		this.map = new Map( gfx )
		this.gfx = gfx
		
		this.partHand = new ParticleHandler()
		const self = this
		ParticleHandler.Get = function() { return( self.partHand ) }
		
		this.playerManager = new PlayerManager()
		
		this.enemies = []
		
		this.playerBullets = []
		this.enemyBullets = []
		
		this.playerManager.SetInfo( this.enemies,this.playerBullets,this.enemyBullets )
		
		this.enemySpawnTimer = new Timer( 0.6 ) // from 1.0
		this.enemyActivateTimer = new Timer( 1.0 )
		this.waveCounter = 4 // 0
		// this.bossInterval = 3
		
		this.areas = [
			new TavernArea( 3,"Images/Tiles/TavernTiles.png" ),
			new TownArea( 4,"Images/Tiles/TownTiles.png" ),
			new CastleArea( 3,"Images/Tiles/DungeonTiles.png" ),
			new CastleArea( 99,"Images/Tiles/DungeonTiles.png" ),
			new Area( 3,"Images/Tiles/ForestTiles.png" )
		]
		
		this.curArea = 1
		
		this.LoadMap()
		
		this.disableSpawnEnemies = false
	}
	
	Update( mouse,kbd,gpad )
	{
		if( kbd.KeyDown( 8 ) ) this.enemies.length = 0
		
		this.playerManager.Update( mouse,kbd,gpad,this.map,
			this.enemies,this.playerBullets,this.enemyBullets,this.gfx )
		
		if( this.enemyActivateTimer.Update() )
		{
			const enemyUpdateInfo = {}
			enemyUpdateInfo.players = this.playerManager.GetPlayerTargets()
			enemyUpdateInfo.map = this.map
			enemyUpdateInfo.enemyBullets = this.enemyBullets
			
			for( const enemy of this.enemies ) enemy.Update( enemyUpdateInfo )
		}
		else
		{
			for( const enemy of this.enemies ) enemy.UpdateAnim()
		}
			
		const playerList = this.playerManager.GetAllPlayers()
		for( const bullet of this.playerBullets ) bullet.Update( this.map,this.enemies )
		for( const bullet of this.enemyBullets ) bullet.Update( this.map,playerList )
		
		this.partHand.Update()
		
		this.RemoveDeadEntities( this.enemies )
		this.RemoveDeadEntities( this.playerBullets )
		this.RemoveDeadEntities( this.enemyBullets )
		this.RemoveDeadEntities( this.partHand.GetParts() )
		
		if( this.enemies.length == 0 && this.enemySpawnTimer.Update() && !this.disableSpawnEnemies )
		{
			this.playerManager.TryReviveGhosts()
			
			this.enemyActivateTimer.Reset()
			
			const bossWave = this.areas[this.curArea].GetBossWave()
			
			if( this.waveCounter == bossWave )
			{
				// this.map.CreateWalledEmptyMap()
				this.areas[this.curArea].GenerateBossMap( this.map )
			}
			else if( this.waveCounter == bossWave + 1 )
			{
				// this.enemies.push( new SkeletonBoss( new Vec2( this.gfx.width / 2,this.gfx.height / 2 ) ) )
				this.enemies.push( this.areas[this.curArea].GenerateBoss( this.map ) )
			}
			else if( this.waveCounter == bossWave + 2 )
			{
				// todo: loot!
				
				this.waveCounter = -1 // cuz it gets incremented later
				// this.map.GenerateMap()
				++this.curArea
				this.LoadMap()
			}
			else
			{
				// this.SpawnEnemyWave( this.enemyCounter )
				const enemies = this.areas[this.curArea].GenerateEnemyWave( this.map )
				for( const enemy of enemies ) this.enemies.push( enemy )
				this.areas[this.curArea].IncrementWave()
				
				// this.enemyCounter += Utils.RandInt( 1,4 )
			}
			
			this.enemySpawnTimer.Reset()
			++this.waveCounter
		}
	}
	
	Draw( gfx )
	{
		this.map.Draw( gfx )
		
		this.playerManager.Draw( gfx )
		
		for( const enemy of this.enemies ) enemy.Draw( gfx )
			
		for( const bullet of this.playerBullets ) bullet.Draw( gfx )
		for( const bullet of this.enemyBullets ) bullet.Draw( gfx )
		
		this.partHand.Draw( gfx )
	}
	
	RemoveDeadEntities( entityArr )
	{
		for( let i = 0; i < entityArr.length; ++i )
		{
			if( entityArr[i].IsDead() )
			{
				entityArr.splice( i,1 )
				--i
			}
		}
	}
	
	LoadMap()
	{
		this.map.SetTileSprSht( this.areas[this.curArea].GetTileSheet() )
		this.areas[this.curArea].GenerateMap( this.map )
	}
}