class PlayerManager
{
	constructor()
	{
		this.players = []
		
		this.ctrls = [
			new WASDControl( "W","S","A","D" ),
			new WASDControl( 38,40,37,39 ),
			new WASDControl( "I","K","J","L" ),
			new MouseControl(),
			new GamepadControl( 0,0,10 ),
			new GamepadControl( 0,1,11 )
		]
		
		this.deadPlayers = []
		
		this.maxPlayers = this.ctrls.length
		
		this.unspawnedPlayers = []
		for( let i = 0; i < this.maxPlayers; ++i )
		{
			this.unspawnedPlayers.push( i )
			this.players.push( new PlaceholderPlayer( this.ctrls[i] ) )
		}
		
		this.colors = [
			"white",
			"black",
			"darkturquoise",
			"slateblue",
			"darksalmon",
			"mediumseagreen"
		]
		
		this.canAdd = false
		this.canRemove = false
		
		this.enemyList = []
		this.playerBullets = []
		this.enemyBullets = []
		
		this.canSpawnSpecificPlayer = true
	}
	
	Update( mouse,kbd,gpad,map,enemies,playerBullets,enemyBullets,gfx )
	{
		// let spawnPlayer = -1
		// if( kbd.KeyDown( "1" ) ) spawnPlayer = 0
		// else if( kbd.KeyDown( "2" ) ) spawnPlayer = 1
		// else if( kbd.KeyDown( "3" ) ) spawnPlayer = 2
		// else if( kbd.KeyDown( "4" ) ) spawnPlayer = 3
		// else if( kbd.KeyDown( "5" ) ) spawnPlayer = 4
		// else if( kbd.KeyDown( "6" ) ) spawnPlayer = 5
		// else this.canSpawnSpecificPlayer = true
		// if( spawnPlayer > -1 && this.canSpawnSpecificPlayer )
		// {
		// 	this.SpawnSpecificPlayer( spawnPlayer,map.Tile2WorldPos( map.GetRandEmptyTilePos() ),map )
		// 	this.canSpawnSpecificPlayer = false
		// }
		
		const playerUpdateInfo = {}
		playerUpdateInfo.mouse = mouse
		playerUpdateInfo.kbd = kbd
		playerUpdateInfo.gpad = gpad
		playerUpdateInfo.map = map
		playerUpdateInfo.enemies = enemies
		playerUpdateInfo.playerBullets = playerBullets
		playerUpdateInfo.enemyBullets = enemyBullets
		playerUpdateInfo.gfx = gfx
		
		for( const player of this.players )
		{
			player.Update( playerUpdateInfo )
			
			player.UpdateMisc()
		}
		
		// const addDown = kbd.KeyDown( 187 )
		// const removeDown = kbd.KeyDown( 189 )
		// if( addDown && this.canAdd )
		// {
		// 	this.AddPlayer( map.Tile2WorldPos( map.GetRandEmptyTilePos() ),map )
		// }
		// else if( removeDown && this.canRemove )
		// {
		// 	this.RemovePlayer()
		// }
		// this.canAdd = !addDown
		// this.canRemove = !removeDown
		
		for( let i = 0; i < this.players.length; ++i )
		{
			const curPlayer = this.players[i]
			if( curPlayer.isPlaceholder && curPlayer.SpawnIn() )
			{
				let spawnPos = map.Tile2WorldPos( map.GetRandEmptyTilePos() )
				if( this.players[i].ctrls.isMouse )
				{
					const mouseTile = map.World2TilePos( mouse.GetPos() )
					if( map.IsTileOnScreen( mouseTile.x,mouseTile.y ) &&
						map.IsWalkableTile( mouseTile.x,mouseTile.y ) )
					{
						spawnPos = map.Tile2WorldPos( mouseTile )
					}
				}
				
				Utils.ShuffleArr( this.unspawnedPlayers )
				const newPlayer = this.SpawnSpecificPlayer( this.unspawnedPlayers.pop(),
					this.players[i].ctrls,
					spawnPos,
					map )
				this.players.splice( i,1,newPlayer )
			}
		}
		
		this.CheckForGhosts()
	}
	
	Draw( gfx )
	{
		for( const player of this.players ) player.Draw( gfx )
	}
	
	// AddPlayer( pos,map )
	// {
	// 	if( this.players.length < this.maxPlayers )
	// 	{
	// 		this.SpawnSpecificPlayer( this.players.length,pos,map )
	// 	}
	// 	else
	// 	{
	// 		console.log( "Already at max players!" )
	// 	}
	// }
	
	SpawnSpecificPlayer( index,ctrls,pos,map )
	{
		// if( this.players.length < this.maxPlayers )
		{
			const playerPos = pos.Copy().Add( Vec2.One().Scale( map.tileSize / 2 ) )
			let player = null
			if( index == 0 ) player = new Knight( playerPos,ctrls )
			else if( index == 1 ) player = new Archer( playerPos,ctrls )
			else if( index == 2 ) player = new Healer( playerPos,ctrls )
			else if( index == 3 ) player = new Rogue( playerPos,ctrls )
			else if( index == 4 ) player = new Lancer( playerPos,ctrls )
			else if( index == 5 ) player = new Wizard( playerPos,ctrls )
			// this.players.push( player )
			
			player.SetupInfo( this.enemyList,this.playerBullets,this.players,this.enemyBullets )
			
			// const lastPlayer = this.players.length - 1
			// this.players[lastPlayer].col = this.colors[lastPlayer]
			return( player )
		}
		// else
		// {
		// 	console.log( "Already at max players!" )
		// }
	}
	
	// RemovePlayer()
	// {
	// 	this.players.pop()
	// }
	
	CheckForGhosts()
	{
		for( let i = 0; i < this.players.length; ++i )
		{
			if( this.players[i].hp <= 0 && !this.players[i].isGhost )
			{
				this.players[i].OnKill()
				this.deadPlayers[i] = this.players[i]
				this.players[i] = new Ghost( this.players[i].pos.Copy(),this.ctrls[i] )
			}
		}
	}
	
	TryReviveGhosts()
	{
		// if( this.GetLivingPlayers().length != this.GetAllPlayers().length ) console.log( "no reviving allowed!" )
		
		for( let i = 0; i < this.players.length; ++i )
		{
			if( this.players[i].isGhost )
			{
				this.players[i] = this.deadPlayers[i]
				this.players[i].hp = this.players[i].maxHP
			}
		}
		
		this.deadPlayers = []
	}
	
	SetInfo( enemies,playerBullets,enemyBullets )
	{
		this.enemyList = enemies
		this.playerBullets = playerBullets
		this.enemyBullets = enemyBullets
	}
	
	GetLivingPlayers()
	{
		// return( this.players )
		const players = []
		for( const player of this.players )
		{
			if( !player.isGhost && !player.isPlaceholder ) players.push( player )
		}
		return( players )
	}
	
	GetPlayerTargets()
	{
		const players = []
		for( const player of this.players )
		{
			if( !player.isGhost && player.targetable ) players.push( player )
		}
		return( players )
	}
	
	GetAllPlayers()
	{
		return( this.players )
	}
}