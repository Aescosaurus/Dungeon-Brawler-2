class Main
{
	constructor()
	{
		this.gfx = new Graphics()
		this.kbd = new Keyboard()
		this.mouse = new Mouse( this.gfx )
		this.gpad = new Gamepad()
		
		this.map = new Map( this.gfx )
		
		this.playerManager = new PlayerManager()
		
		this.enemies = []
		
		this.playerBullets = []
		this.enemyBullets = []
		
		this.playerManager.SetInfo( this.enemies,this.playerBullets,this.enemyBullets )
		
		this.enemySpawnTimer = new Timer( 1.0 )
		this.enemyCounter = 3
		this.waveCounter = 0
		this.bossInterval = 3
	}
	
	Update()
	{
		if( this.kbd.KeyDown( 8 ) ) this.enemies.length = 0
		
		this.playerManager.Update( this.mouse,this.kbd,this.gpad,this.map,
			this.enemies,this.playerBullets,this.enemyBullets,this.gfx )
		
		const enemyUpdateInfo = {}
		enemyUpdateInfo.players = this.playerManager.GetPlayerTargets()
		enemyUpdateInfo.map = this.map
		enemyUpdateInfo.enemyBullets = this.enemyBullets
		
		for( const enemy of this.enemies ) enemy.Update( enemyUpdateInfo )
			
		const playerList = this.playerManager.GetAllPlayers()
		for( const bullet of this.playerBullets ) bullet.Update( this.map,this.enemies )
		for( const bullet of this.enemyBullets ) bullet.Update( this.map,playerList )
		
		this.RemoveDeadEntities( this.enemies )
		this.RemoveDeadEntities( this.playerBullets )
		this.RemoveDeadEntities( this.enemyBullets )
		
		if( this.enemies.length == 0 && this.enemySpawnTimer.Update() )
		{
			this.playerManager.TryReviveGhosts()
			
			if( this.waveCounter == this.bossInterval )
			{
				this.map.EmptyCenter()
			}
			else if( this.waveCounter == this.bossInterval + 1 )
			{
				// this.enemies.push( new SkeletonBoss( new Vec2( this.gfx.width / 2,this.gfx.height / 2 ) ) )
				this.enemies.push( new DarkHorse( new Vec2( this.gfx.width / 2,this.gfx.height / 2 ) ) )
			}
			else if( this.waveCounter == this.bossInterval + 2 )
			{
				// todo: loot!
				
				this.waveCounter = 0
				this.map.GenerateMap()
			}
			else
			{
				this.SpawnEnemyWave( this.enemyCounter )
				this.enemyCounter += Utils.RandInt( 1,4 )
			}
			
			this.enemySpawnTimer.Reset()
			++this.waveCounter
		}
	}
	
	Draw()
	{
		this.map.Draw( this.gfx )
		
		this.playerManager.Draw( this.gfx )
		
		for( const enemy of this.enemies ) enemy.Draw( this.gfx )
			
		for( const bullet of this.playerBullets ) bullet.Draw( this.gfx )
		for( const bullet of this.enemyBullets ) bullet.Draw( this.gfx )
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
	
	SpawnEnemyWave( amount )
	{
		for( let i = 0; i < amount; ++i )
		{
			this.enemies.push( this.CreateRandEnemy( this.map.Tile2WorldPos( this.map.GetRandEmptyTilePos() )
				.Add( Vec2.One().Scale( 4 ) ) ) )
		}
	}
	
	CreateRandEnemy( pos )
	{
		const rng = Utils.RandFloat( 0,1 )
		
		if( rng < 0.6 ) return( new Skeleton( pos ) )
		else if( rng < 0.9 ) return( new Vampire( pos ) )
		else if( rng < 1 ) return( new Imp( pos ) )
		else return( new Enemy( pos ) )
	}
}

const main = new Main()

setInterval( function()
{
	main.gfx.DrawRect( 0,0,main.gfx.width,main.gfx.height,"#000000" )
	main.gpad.PollGamepads()
	main.Update()
	main.Draw()
},1000 / 60.0 )