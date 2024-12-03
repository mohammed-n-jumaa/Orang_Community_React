<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('full_name');
        $table->string('email')->unique();
        $table->string('password');
        $table->string('image')->nullable();
        $table->enum('academy', ['Amman', 'Zarqa', 'Irbid', 'Aqaba', 'Balqa']);
        $table->string('socialmedia')->nullable();
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('users');
}

};
