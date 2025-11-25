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
		
		this.neutralEntities = []
		
		this.playerManager.SetInfo( this.enemies,this.playerBullets,this.enemyBullets )
		
		this.enemySpawnTimer = new Timer( 0.6 ) // from 1.0
		this.enemyActivateTimer = new Timer( 1.0 )
		this.waveCounter = 0
		// this.bossInterval = 3
		this.canSkip = false // don't edit this
		this.gameOverCheckTimer = new Timer( 0.7 )
		this.gameOverTimer = new Timer( 1.0 )
		
		this.areas = [
			new CharSelectArea( 1,"Images/Tiles/CharSelectTiles.png" ), // this must always be areas[0]
			new TavernArea( 3,"Images/Tiles/TavernTiles.png" ),
			new TownArea( 4,"Images/Tiles/TownTiles.png" ),
			new OrchardArea( 4,"Images/Tiles/OrchardTiles.png" ),
			new ForestArea( 4,"Images/Tiles/ForestTiles.png" ),
			new SwampArea( 3,"Images/Tiles/SwampTiles.png" ),
			new TempleArea( 4,"Images/Tiles/TempleTiles.png" ),
			new CastleArea( 3,"Images/Tiles/DungeonTiles.png" ),
		]
		
		this.ctrlsSpr = new Sprite( "Images/UI/Controls.png" )
		this.tutTextSpr = new Sprite( "Images/UI/PossessTutText.png" )
		this.titleSpr = new Sprite( "Images/UI/Title.png" )
		this.gameOverSpr = new Sprite( "Images/UI/GameOver.png" )
		
		this.curArea = 6
		// CharSelectMode, RegularAreaMode, ArcadeMode
		this.SetMode( PlayerManager.CharSelectMode )
		this.enableEnemySpawning = true
		this.enableGameOver = false
		
		this.LoadMap()
	}
	
	Update( mouse,kbd,gpad )
	{
		if( Main.CheatsEnabled )
		{
			if( kbd.KeyDown( 8 ) ) this.enemies.length = 0 // backspace
			if( kbd.KeyDown( 13 ) ) // enter
			{
				if( this.canSkip )
				{
					this.canSkip = false
					// if( this.curArea < this.areas.length - 1 )
					// {
					// 	this.waveCounter = this.areas[this.curArea].GetBossWave() + 2
					// }
					// this.enemies.length = 0
					this.GotoNextArea()
				}
			}
			else this.canSkip = true
		}
		
		this.playerManager.Update( mouse,kbd,gpad,this.map,
			this.enemies,this.playerBullets,this.enemyBullets,this.gfx,this.attackArea )
		
		const playerTargets = this.playerManager.GetPlayerTargets()
		if( this.enemyActivateTimer.Update() )
		{
			const enemyUpdateInfo = {}
			enemyUpdateInfo.players = playerTargets
			enemyUpdateInfo.map = this.map
			enemyUpdateInfo.enemyBullets = this.enemyBullets
			enemyUpdateInfo.enemies = this.enemies
			
			for( const enemy of this.enemies ) enemy.Update( enemyUpdateInfo )
		}
		else
		{
			for( const enemy of this.enemies ) enemy.UpdateAnim()
		}
		
		const livingPlayers = this.playerManager.GetLivingPlayers()
		for( const bullet of this.playerBullets ) bullet.Update( this.map,this.enemies )
		for( const bullet of this.enemyBullets ) bullet.Update( this.map,livingPlayers )
		
		const neutralEntityUpdateInfo = {}
		neutralEntityUpdateInfo.map = this.map
		neutralEntityUpdateInfo.playerManager = this.playerManager
		neutralEntityUpdateInfo.playerList = this.playerManager.GetAllPlayers()
		neutralEntityUpdateInfo.areaManager = this
		neutralEntityUpdateInfo.enemyBullets = this.enemyBullets
		for( const entity of this.neutralEntities ) entity.Update( neutralEntityUpdateInfo )
		
		this.partHand.Update()
		
		this.RemoveDeadEntities( this.enemies )
		this.RemoveDeadEntities( this.playerBullets )
		this.RemoveDeadEntities( this.enemyBullets )
		this.RemoveDeadEntities( this.partHand.GetParts() )
		this.RemoveDeadEntities( this.neutralEntities )
		
		if( this.enemies.length == 0 && this.enemySpawnTimer.Update() && this.enableEnemySpawning )
		{
			this.playerManager.TryReviveGhosts()
			
			this.enemyActivateTimer.Reset()
			
			const bossWave = this.areas[this.curArea].GetBossWave()
			
			if( this.waveCounter == bossWave )
			{
				// this.map.CreateWalledEmptyMap()
				this.areas[this.curArea].GenerateBossMap( this.map,this.enemies )
			}
			else if( this.waveCounter == bossWave + 1 )
			{
				// this.enemies.push( new SkeletonBoss( new Vec2( this.gfx.width / 2,this.gfx.height / 2 ) ) )
				this.enemies.push( this.areas[this.curArea].GenerateBoss( this.map,this.enemies ) )
			}
			else if( this.waveCounter == bossWave + 2 )
			{
				// todo: loot!
				
				this.GotoNextArea()
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
		
		if( this.enableGameOver && this.enableEnemySpawning && this.curArea > 0 && this.gameOverCheckTimer.Update() )
		{
			if( this.playerManager.AllPlayersGhosts() )
			{
				if( this.gameOverTimer.Update() )
				{
					this.gameOverTimer.Reset()
					this.curArea = 0
					this.enemies.length = 0
					this.enemyBullets.length = 0
					this.SetMode( PlayerManager.CharSelectMode )
					this.enemySpawnTimer.Reset()
					this.waveCounter = 0
					this.playerManager.ResetPlayerCtrls()
					for( const area of this.areas ) area.curWave = 0
					this.LoadMap()
				}
			}
			else this.gameOverCheckTimer.Reset()
		}
	}
	
	Draw( gfx )
	{
		this.map.Draw( gfx )
		
		if( this.curArea == 0 )
		{
			gfx.DrawSprite( 145,97,this.tutTextSpr )
			gfx.DrawSprite( 148,109,this.ctrlsSpr )
		}
		
		for( const entity of this.neutralEntities ) entity.Draw( gfx )
		
		for( const enemy of this.enemies ) enemy.Draw( gfx )
		
		this.playerManager.Draw( gfx )
			
		for( const bullet of this.playerBullets ) bullet.Draw( gfx )
		for( const bullet of this.enemyBullets ) bullet.Draw( gfx )
		
		this.partHand.Draw( gfx )
		
		if( this.curArea == 0 ) gfx.DrawSprite( gfx.width / 2,8,this.titleSpr,false,true )
		else if( this.gameOverCheckTimer.IsDone() ) gfx.DrawSprite( gfx.width / 2,gfx.height / 2,this.gameOverSpr,false,true )
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
		this.playerManager.ClearUnusedGhosts() // this is needed for char select area
		this.neutralEntities.length = 0
		
		this.map.SetTileSprSht( this.areas[this.curArea].GetTileSheet() )
		this.areas[this.curArea].GenerateMap( this.map,this.neutralEntities )
		
		this.attackArea = this.areas[this.curArea].GetAttackArea()
		
		this.playerManager.SetMode( this.curArea == 0
			? PlayerManager.CharSelectMode
			: this.mode )
		if( this.curArea == 0 )
		{
			this.playerManager.SpawnCharSelectGhosts( this.areas[0].GetGhostTiles(),this.map )
			
			this.playerManager.SpawnPlayerSwapEntities( this.areas[0].GetPlayerSpots(),this.map,this.neutralEntities )
		}
		else if( this.mode == PlayerManager.CharSelectMode )
		{
			// this.SetMode( PlayerManager.RegularAreaMode )
			this.SetMode( PlayerManager.ArcadeMode )
		}
	}
	
	GotoNextArea()
	{
		this.enemies.length = 0
		this.waveCounter = -1 // cuz it gets incremented later
		// this.map.GenerateMap()
		++this.curArea
		if( this.curArea >= this.areas.length ) this.curArea = 0
		this.LoadMap()
		if( this.curArea > 0 ) this.playerManager.CenterPlayers( this.map )
	}
	
	SetMode( mode )
	{
		this.mode = mode
		this.playerManager.SetMode( this.mode )
	}
}